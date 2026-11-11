import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors({ origin: env.clientUrl }));
app.use(express.json({ limit: "100kb" }));

app.use("/api/health", healthRoutes);
// Las demás rutas se agregan aquí en las próximas partes:
// app.use("/api/auth", authRoutes) ...

app.use(notFound);
app.use(errorHandler);

export default app;
