import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { chatLimiter } from "../middlewares/rateLimit.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("cliente"), chatLimiter, sendMessage);

export default router;
