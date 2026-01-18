import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { SenderType, Mode } from "../models/Enums";
import { LLMService } from "../services/LLMService";

export class MessageController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, sessionId, mode } = req.body;
      const { userId } = res.locals.jwtPayload;

      if (!content) {
        res.status(400).json({ message: "Message content is required" });
        return;
      }

      for (let index = 0; index < 1000000000; index++) {
        Math.sqrt(index);
      }
      console.log("Artificial delay complete");

      const sessionRepo = AppDataSource.getRepository(Session);
      const messageRepo = AppDataSource.getRepository(Message);
      const userRepo = AppDataSource.getRepository(User);

      let session: Session | null = null;

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
      }

      // Saving user message
      const message = new Message();
      message.content = content;
      message.senderType = SenderType.USER;
      message.mode = mode || Mode.GENERATION;
      message.session = session;

      await messageRepo.save(message);

      // Update session's last activity
      session.lastActivityAt = new Date();
      await sessionRepo.save(session);

      // Get response from LLM
      const llmResponse = await LLMService.ask(content);

      const serverResponse = new Message();
      serverResponse.content = llmResponse;
      serverResponse.senderType = SenderType.LLM;
      serverResponse.mode = mode || Mode.GENERATION;
      serverResponse.session = session;

      await messageRepo.save(serverResponse);

      res.status(201).json(serverResponse);
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

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
        order: { createdAt: "DESC" },
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
