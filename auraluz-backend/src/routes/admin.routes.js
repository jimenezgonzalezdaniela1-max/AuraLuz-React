import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = Router();

// TODAS las rutas de este archivo exigen sesión válida Y rol de administrador.
// En la Parte 7 se agregan aquí las rutas del panel (clientes, pedidos).
router.use(requireAuth, requireRole("admin"));

router.get("/ping", (req, res) => {
  res.json({ ok: true, mensaje: "Acceso de administrador verificado." });
});

export default router;
