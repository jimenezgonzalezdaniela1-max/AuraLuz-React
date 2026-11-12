import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signToken(user) {
  return jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user._id),
    expiresIn: env.jwtExpiresIn,
    algorithm: "HS256",
  });
}

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });
