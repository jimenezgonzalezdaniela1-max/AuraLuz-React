import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message;

  if (err.type === "entity.parse.failed") {
    status = 400;
    message = "El cuerpo de la petición no es un JSON válido.";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "La petición es demasiado grande.";
  } else if (err.name === "MulterError") {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "La imagen supera el máximo de 2 MB." : "Archivo inválido.";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(" ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Dato inválido.";
  } else if (err.code === 11000) {
    status = 409;
    message = "Ese registro ya existe.";
  }

  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 && env.nodeEnv === "production" ? "Error interno del servidor." : message,
  });
}
