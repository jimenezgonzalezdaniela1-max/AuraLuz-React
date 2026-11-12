import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { globalLimiter } from "./middlewares/rateLimit.js";
import { rejectOperators } from "./middlewares/sanitize.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Detrás de un proxy (Render, Railway...) hace falta para ver la IP real de cada visitante
if (env.trustProxy) app.set("trust proxy", env.trustProxy);

app.use(helmet()); // cabeceras de seguridad
app.use(cors({ origin: env.clientOrigins, methods: ["GET", "POST", "PATCH"] }));
app.use(express.json({ limit: "100kb" }));
app.use(rejectOperators);
app.use("/api", globalLimiter);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
