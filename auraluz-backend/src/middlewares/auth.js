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
