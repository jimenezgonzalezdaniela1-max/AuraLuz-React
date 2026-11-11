import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    ok: true,
    servicio: "auraluz-backend",
    baseDeDatos: mongoose.connection.readyState === 1 ? "conectada" : "desconectada",
    hora: new Date().toISOString(),
  });
});

export default router;
