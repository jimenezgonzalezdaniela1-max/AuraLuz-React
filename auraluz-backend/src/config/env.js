import "dotenv/config";

const required = ["MONGODB_URI"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(`Faltan variables de entorno: ${missing.join(", ")}. Revisa tu archivo .env`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
