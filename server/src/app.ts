import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/chat", messageRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ message: "Backend Server is running!" });
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err,
  });
});

export default app;
