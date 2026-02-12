import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import messageRoutes from "./routes/message.routes";
import snippetRoutes from "./routes/snippet.routes";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dev Assistant API",
      version: "1.0.0",
      description: "API Documentation For Routes In Local Personal DEV Assistant Application",
    },
    servers: [
      { url: "http://localhost:8080" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer" },
            username: { type: "string" },
            role: { type: "string", enum: ["ADMIN", "REGULAR", "GUEST"] },
          },
        },
        Session: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            lastActivityAt: { type: "string", format: "date-time" },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "integer" },
            content: { type: "string" },
            senderType: { type: "string", enum: ["USER", "LLM"] },
            mode: { type: "string", enum: ["GENERATION", "ANALYSIS", "DEBUG"] },
            createdAt: { type: "string", format: "date-time" },
            feedback: { $ref: "#/components/schemas/Feedback" },
          },
        },
        Feedback: {
          type: "object",
          properties: {
            id: { type: "integer" },
            isPositive: { type: "boolean" },
            comment: { type: "string" },
          },
        },
        Snippet: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            language: { type: "string" },
            code: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", authRoutes);
app.use("/api/chat", messageRoutes);
app.use("/api/snippets", snippetRoutes);

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
