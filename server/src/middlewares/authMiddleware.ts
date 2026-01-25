import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Config } from "../config/config";
import { AppDataSource } from "../config/data-source";
import { BlacklistedToken } from "../models/BlacklistedToken";

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const blacklistRepo = AppDataSource.getRepository(BlacklistedToken);
  const isBlacklisted = await blacklistRepo.findOneBy({ token });

  if (isBlacklisted) {
    res.status(401).json({ message: "Token invalidated (Logged out)" });
    return;
  }

  try {
    const jwtPayload = jwt.verify(token, Config.JWT_SECRET) as any;
    res.locals.jwtPayload = jwtPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
