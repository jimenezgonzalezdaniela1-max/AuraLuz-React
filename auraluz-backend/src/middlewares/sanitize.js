import { HttpError } from "../utils/httpError.js";

// Defensa contra inyección NoSQL: rechaza cuerpos o parámetros con claves como "$gt" o "a.b"
const hasOperator = (v, depth = 0) => {
  if (depth > 6) return true; // anidación sospechosa
  if (Array.isArray(v)) return v.some((x) => hasOperator(x, depth + 1));
  if (v && typeof v === "object") {
    return Object.entries(v).some(([k, val]) => k.startsWith("$") || k.includes(".") || hasOperator(val, depth + 1));
  }
  return false;
};

export function rejectOperators(req, res, next) {
  if (hasOperator(req.body) || hasOperator(req.query)) return next(new HttpError(400, "Petición inválida."));
  next();
}
