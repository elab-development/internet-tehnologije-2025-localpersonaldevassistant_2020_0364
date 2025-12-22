import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { checkJwt } from "../middlewares/AuthMiddleware"; // Importing from your existing file [cite: 114]

const router = Router();

router.post("/", checkJwt, MessageController.sendMessage);

export default router;
