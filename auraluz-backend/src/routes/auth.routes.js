import { Router } from "express";
import { register, login, adminLogin, me } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/me", requireAuth, me);

export default router;
