import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";
import { BlacklistedToken } from "../models/BlacklistedToken";
import { UserRole } from "../models/Enums";

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

      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, Config.JWT_SECRET, { expiresIn: "1 hour" });

      res.json({ message: "Login successful", token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async loginAsGuest(req: Request, res: Response): Promise<void> {
    try {
      const userRepo = AppDataSource.getRepository(User);

      const guestUsername = `guest_${Date.now()}`;
      const dummyPassword = await bcrypt.hash("guest_secret", 10);

      const guestUser = new User();
      guestUser.username = guestUsername;
      guestUser.password = dummyPassword;
      guestUser.role = UserRole.GUEST;

      await userRepo.save(guestUser);

      const token = jwt.sign({ userId: guestUser.id, username: guestUser.username, role: UserRole.GUEST }, Config.JWT_SECRET, { expiresIn: "24h" });

      res.json({ message: "Guest session started", token, user: { username: guestUsername, role: "GUEST" } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
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

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = res.locals.token;
      const decoded: any = jwt.decode(token);

      if (!decoded || !decoded.exp) {
        res.status(400).json({ message: "Invalid token data" });
        return;
      }

      const blacklistRepo = AppDataSource.getRepository(BlacklistedToken);
      const blacklistedToken = new BlacklistedToken();
      blacklistedToken.token = token;

      // Convert Unix timestamp (seconds) to JS Date (milliseconds)
      blacklistedToken.expiresAt = new Date(decoded.exp * 1000);

      await blacklistRepo.save(blacklistedToken);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
