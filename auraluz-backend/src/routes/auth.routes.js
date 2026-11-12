import { Router } from "express";
import { register, login, adminLogin, me } from "../controllers/auth.controller.js";
import { loginLimiter, adminLoginLimiter, registerLimiter } from "../middlewares/rateLimit.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/admin/login", adminLoginLimiter, adminLogin);
router.get("/me", requireAuth, me);

export default router;
