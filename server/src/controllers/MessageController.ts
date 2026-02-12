import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { Feedback } from "../models/Feedback"; // [NEW] Import Feedback
import { SenderType, Mode } from "../models/Enums";
import { LLMService } from "../services/LLMService";
import titleSummaryPrompt from "../prompts/titleSummary";
import analysisPrompt from "../prompts/analysisPrompt";
import debugPrompt from "../prompts/debugPrompt";
import generationPrompt from "../prompts/generationPrompt";

export class MessageController {
  /**
   * @openapi
   * /api/chat:
   *   post:
   *     tags:
   *       - Chat
   *     summary: Send message to chat
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - content
   *             properties:
   *               content:
   *                 type: string
   *                 description: User message content
   *     responses:
   *       200:
   *         description: Chat response
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 reply:
   *                   type: string
   *       401:
   *         description: Unauthorized
   */
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, sessionId, mode } = req.body;
      const { userId } = res.locals.jwtPayload;

      if (!content) {
        res.status(400).json({ message: "Message content is required" });
        return;
      }

      const sessionRepo = AppDataSource.getRepository(Session);
      const messageRepo = AppDataSource.getRepository(Message);
      const userRepo = AppDataSource.getRepository(User);

      let session: Session | null = null;
      let isNewSession = false;

      if (sessionId) {
        session = await sessionRepo.findOne({
          where: { id: sessionId },
          relations: ["user"],
        });

        if (session && session.user.id !== userId) {
          res.status(403).json({ message: "Unauthorized access to this session" });
          return;
        }
      }

      if (!session) {
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        session = new Session();
        session.title = content.substring(0, 30) + "...";
        session.user = user;
        await sessionRepo.save(session);
        isNewSession = true;
      }

      const message = new Message();
      message.content = content;
      message.senderType = SenderType.USER;
      message.mode = mode || Mode.GENERATION;
      message.session = session;
      await messageRepo.save(message);

      session.lastActivityAt = new Date();
      await sessionRepo.save(session);

      let finalPrompt = "";
      switch (mode) {
        case Mode.ANALYSIS:
          finalPrompt = analysisPrompt(content);
          break;
        case Mode.DEBUG:
          finalPrompt = debugPrompt(content);
          break;
        case Mode.GENERATION:
        default:
          finalPrompt = generationPrompt(content);
          break;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("X-Accel-Buffering", "no");

      const fullLlmResponse = await LLMService.streamAsk(finalPrompt, res);

      const serverMessage = new Message();
      serverMessage.content = fullLlmResponse;
      serverMessage.senderType = SenderType.LLM;
      serverMessage.mode = mode || Mode.GENERATION;
      serverMessage.session = session;

      if (isNewSession) {
        const titlePrompt = titleSummaryPrompt(content, fullLlmResponse);
        const generatedTitle = await LLMService.ask(titlePrompt);
        if (generatedTitle && !generatedTitle.includes("unavailable")) {
          session.title = generatedTitle.replace(/^"|"$/g, "").trim();
          await sessionRepo.save(session);
        }
      }

      const savedMessage = await messageRepo.save(serverMessage);

      res.write(`data: ${JSON.stringify({ type: "DONE", messageId: savedMessage.id, sessionId: session.id })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Send message error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
        res.end();
      }
    }
  }

  /**
   * @openapi
   * /api/chat/sessions:
   *   get:
   *     tags:
   *       - Chat
   *     summary: Get all sessions
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Session list
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Session'
   */
  static async getAllSessions(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = res.locals.jwtPayload;
      const sessionRepo = AppDataSource.getRepository(Session);

      const sessions = await sessionRepo.find({
        where: { user: { id: userId } },
        order: { lastActivityAt: "DESC" },
      });
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Get sessions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @openapi
   * /api/chat/{sessionId}/messages:
   *   get:
   *     tags:
   *       - Chat
   *     summary: Get messages by session
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Message history
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Message'
   */
  static async getMessagesBySession(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = res.locals.jwtPayload;
      const { sessionId } = req.params;

      if (!sessionId) {
        res.status(400).json({ message: "Session ID is required" });
        return;
      }

      const sessionRepo = AppDataSource.getRepository(Session);
      const messageRepo = AppDataSource.getRepository(Message);
      const session = await sessionRepo.findOne({
        where: { id: parseInt(sessionId) },
        relations: ["user"],
      });

      if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
      }

      if (session.user.id !== userId) {
        res.status(403).json({ message: "Unauthorized access to this session" });
        return;
      }

      const messages = await messageRepo.find({
        where: { session: { id: session.id } },
        relations: ["feedback"],
        order: { createdAt: "DESC" },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @openapi
   * /api/chat/sessions/{sessionId}:
   *   put:
   *     tags:
   *       - Chat
   *     summary: Change session title
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: sessionId
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - title
   *             properties:
   *               title:
   *                 type: string
   *                 example: My Updated Chat Title
   *     responses:
   *       200:
   *         description: Title updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Title updated successfully
   */
  static async updateSessionTitle(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params;
      const { title } = req.body;
      const { userId } = res.locals.jwtPayload;

      if (!title || title.trim() === "") {
        res.status(400).json({ message: "Title is required" });
        return;
      }

      const sessionRepo = AppDataSource.getRepository(Session);
      const session = await sessionRepo.findOne({
        where: { id: parseInt(sessionId) },
        relations: ["user"],
      });

      if (!session) {
        res.status(404).json({ message: "Session not found" });
        return;
      }

      if (session.user.id !== userId) {
        res.status(403).json({ message: "Unauthorized access to this session" });
        return;
      }

      session.title = title;
      await sessionRepo.save(session);

      res.status(200).json({ message: "Session updated", session });
    } catch (error) {
      console.error("Update session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @openapi
   * /api/chat/{messageId}/feedback:
   *   post:
   *     tags:
   *       - Chat
   *     summary: Add feedback
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: messageId
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - isPositive
   *             properties:
   *               isPositive:
   *                 type: boolean
   *               comment:
   *                 type: string
   *     responses:
   *       200:
   *         description: Feedback saved
   */
  static async addFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { messageId } = req.params;
      const { isPositive, comment } = req.body;
      const { userId } = res.locals.jwtPayload;

      const messageRepo = AppDataSource.getRepository(Message);
      const feedbackRepo = AppDataSource.getRepository(Feedback);

      const message = await messageRepo.findOne({
        where: { id: parseInt(messageId) },
        relations: ["session", "session.user", "feedback"],
      });

      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }

      if (message.session.user.id !== userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      let feedback = message.feedback;
      if (!feedback) {
        feedback = new Feedback();
        feedback.message = message;
      }

      feedback.isPositive = isPositive;
      feedback.comment = comment || "";

      await feedbackRepo.save(feedback);

      res.status(200).json({ message: "Feedback submitted", feedback });
    } catch (error) {
      console.error("Feedback error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
