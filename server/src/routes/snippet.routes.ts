import { Router } from "express";
import { SnippetController } from "../controllers/SnippetController";
import { checkJwt } from "../middlewares/authMiddleware";

const router = Router();

router.use(checkJwt);

router.post("/", SnippetController.createSnippet);
router.get("/", SnippetController.getSnippets);
router.delete("/:id", SnippetController.deleteSnippet);

export default router;
