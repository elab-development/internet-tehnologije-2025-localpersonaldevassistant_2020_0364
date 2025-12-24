import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { checkJwt } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", checkJwt, MessageController.sendMessage);
router.get("/sessions", checkJwt, MessageController.getAllSessions);
router.get("/:sessionId/messages", checkJwt, MessageController.getMessagesBySession);

export default router;
