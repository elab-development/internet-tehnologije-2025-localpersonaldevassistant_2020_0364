import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Snippet } from "../models/Snippet";
import { User } from "../models/User";

export class SnippetController {
  static async createSnippet(req: Request, res: Response): Promise<void> {
    try {
      const { code, language } = req.body;
      const { userId } = res.locals.jwtPayload;

      if (!code) {
        res.status(400).json({ message: "Code content is required" });
        return;
      }

      const userRepo = AppDataSource.getRepository(User);
      const snippetRepo = AppDataSource.getRepository(Snippet);

      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const snippet = new Snippet();
      snippet.code = code;
      snippet.language = language || "plaintext";
      const firstLine = code.split("\n").find((l: string) => l.trim().length > 0) || "Code Snippet";
      snippet.title = firstLine.substring(0, 50).trim();
      snippet.user = user;

      await snippetRepo.save(snippet);

      res.status(201).json({ message: "Snippet saved", snippet });
    } catch (error) {
      console.error("Create snippet error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getSnippets(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = res.locals.jwtPayload;
      const snippetRepo = AppDataSource.getRepository(Snippet);

      const snippets = await snippetRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: "DESC" },
      });

      res.status(200).json(snippets);
    } catch (error) {
      console.error("Get snippets error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteSnippet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = res.locals.jwtPayload;
      const snippetRepo = AppDataSource.getRepository(Snippet);

      const snippet = await snippetRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["user"],
      });

      if (!snippet) {
        res.status(404).json({ message: "Snippet not found" });
        return;
      }

      if (snippet.user.id !== userId) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      await snippetRepo.remove(snippet);
      res.status(200).json({ message: "Snippet deleted" });
    } catch (error) {
      console.error("Delete snippet error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
