import { Router } from "express";
import { listProducts } from "../controllers/products.controller.js";

const router = Router();

router.get("/", listProducts); // catálogo público

export default router;
