import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ username });

      if (user === null) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, Config.JWT_SECRET, { expiresIn: "1 hour" });

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required." });
        return;
      }

      const userRepo = AppDataSource.getRepository(User);

      const existingUser = await userRepo.findOneBy({ username });
      if (existingUser) {
        res.status(409).json({ message: "Username already exists." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User();
      newUser.username = username;
      newUser.password = hashedPassword;

      await userRepo.save(newUser);

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
