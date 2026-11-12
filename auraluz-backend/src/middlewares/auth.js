import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { verifyToken } from "../utils/token.js";

// Exige un token válido: Authorization: Bearer <token>. Deja { id, role } en req.auth
export function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token) return next(new HttpError(401, "Debes iniciar sesión."));
  try {
    const payload = verifyToken(token);
    req.auth = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new HttpError(401, "Sesión inválida o vencida."));
  }
}

// Exige uno de los roles indicados y confirma en la base de datos que la cuenta siga existiendo
// con ese rol (un token viejo de una cuenta borrada o degradada deja de servir).
export const requireRole =
  (...roles) =>
  async (req, res, next) => {
    try {
      if (!roles.includes(req.auth?.role)) throw new HttpError(403, "No tienes permiso para esta acción.");
      if (!(await User.exists({ _id: req.auth.id, role: req.auth.role }))) {
        throw new HttpError(401, "Sesión inválida.");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
