import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Message } from "../models/Message";
import { Session } from "../models/Session";
import { User } from "../models/User";
import { SenderType, Mode } from "../models/Enums";

export class MessageController {
  static async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { content, sessionId, mode } = req.body; // Accept sessionId and mode
      const { userId } = res.locals.jwtPayload;

      if (!content) {
        res.status(400).json({ message: "Message content is required" });
        return;
      }

      const sessionRepo = AppDataSource.getRepository(Session);
      const messageRepo = AppDataSource.getRepository(Message);
      const userRepo = AppDataSource.getRepository(User);

      let session: Session | null = null;

      // 1. If sessionId is provided, try to find it
      if (sessionId) {
        session = await sessionRepo.findOne({
          where: { id: sessionId },
          relations: ["user"],
        });

        // Security check: ensure session belongs to current user
        if (session && session.user.id !== userId) {
          res.status(403).json({ message: "Unauthorized access to this session" });
          return;
        }
      }

      // 2. If no session found (or not provided), create a new one
      if (!session) {
        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }

        session = new Session();
        session.title = content.substring(0, 30) + "..."; // Generate title from first message
        session.user = user;
        await sessionRepo.save(session);
      }

      // 3. Create and Save the Message
      const message = new Message();
      message.content = content;
      message.senderType = SenderType.USER; // Always USER for this endpoint
      message.mode = mode || Mode.GENERATION; // Default to GENERATION if not specified
      message.session = session;

      await messageRepo.save(message);

      // 4. Update session lastActivity
      session.lastActivityAt = new Date();
      await sessionRepo.save(session);

      res.status(201).json({
        message: "Message sent",
        payload: {
          message: message,
          sessionId: session.id, // Return sessionId so frontend can continue chat
        },
      });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
