import mongoose from "mongoose";
import { env } from "./env.js";

mongoose.set("strictQuery", true);

export async function connectDB() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
  console.log(`MongoDB conectado: ${mongoose.connection.name}`);
}

export const disconnectDB = () => mongoose.disconnect();
