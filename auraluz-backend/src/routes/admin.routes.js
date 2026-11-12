import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { dashboard, listClients, listOrders, updateOrderStatus } from "../controllers/admin.controller.js";
import { adminListProducts, updateProduct } from "../controllers/products.controller.js";

const router = Router();

// TODAS las rutas de este archivo exigen sesión válida Y rol de administrador.
// En la Parte 7 se agregan aquí las rutas del panel (clientes, pedidos).
router.use(requireAuth, requireRole("admin"));

router.get("/ping", (req, res) => {
  res.json({ ok: true, mensaje: "Acceso de administrador verificado." });
});

router.get("/dashboard", dashboard);
router.get("/clients", listClients);
router.get("/orders", listOrders);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/products", adminListProducts);
router.patch("/products/:slug", updateProduct);

export default router;
