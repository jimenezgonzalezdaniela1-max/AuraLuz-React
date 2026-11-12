import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Siempre lee el .env de la carpeta auraluz-backend, sin importar desde dónde se ejecute
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(root, ".env") });

const required = ["MONGODB_URI", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Faltan variables de entorno: ${missing.join(", ")}. Revisa tu archivo .env`);
}
if (process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET es demasiado corto: usa al menos 32 caracteres aleatorios.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
