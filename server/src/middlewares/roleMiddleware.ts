import { Request, Response, NextFunction } from "express";
import { UserRole } from "../models/Enums";

export const checkRole = (roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jwtPayload = res.locals.jwtPayload;

    if (!jwtPayload) {
      res.status(401).json({ message: "Unauthenticated" });
      return;
    }

    if (!roles.includes(jwtPayload.role)) {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
      return;
    }

    next();
  };
};
