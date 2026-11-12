import { Router } from "express";
import { sendMessage } from "../controllers/chat.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post("/", requireAuth, requireRole("cliente"), sendMessage);

export default router;
