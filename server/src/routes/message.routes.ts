import { Router } from "express";
import { MessageController } from "../controllers/MessageController";
import { checkJwt } from "../middlewares/authMiddleware";
import { checkRole } from "../middlewares/roleMiddleware";
import { UserRole } from "../models/Enums";

const router = Router();

router.use(checkJwt);
router.use(checkRole([UserRole.GUEST, UserRole.REGULAR, UserRole.ADMIN]));

router.post("/", MessageController.sendMessage);
router.get("/sessions", MessageController.getAllSessions);
router.get("/:sessionId/messages", MessageController.getMessagesBySession);
router.put("/sessions/:sessionId", MessageController.updateSessionTitle);

export default router;
