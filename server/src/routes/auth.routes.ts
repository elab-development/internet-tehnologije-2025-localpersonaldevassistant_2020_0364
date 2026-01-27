import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { checkJwt } from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/guest", AuthController.loginAsGuest);
router.post("/register", AuthController.register);
router.post("/logout", checkJwt, AuthController.logout);

export default router;
