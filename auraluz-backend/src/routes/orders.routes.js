import { Router } from "express";
import { createOrder, listMyOrders } from "../controllers/orders.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

router.use(requireAuth, requireRole("cliente"));

router.post("/", createOrder);
router.get("/", listMyOrders);

export default router;
