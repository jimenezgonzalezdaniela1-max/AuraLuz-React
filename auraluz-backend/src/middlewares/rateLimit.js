import rateLimit from "express-rate-limit";

const limiter = ({ windowMs, limit, mensaje, ...rest }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: mensaje },
    ...rest,
  });

const MIN = 60 * 1000;

// Tope general para toda la API, por IP (el panel del admin consulta cada 5 s, por eso es amplio)
export const globalLimiter = limiter({
  windowMs: 15 * MIN,
  limit: 600,
  mensaje: "Demasiadas peticiones. Intenta de nuevo en unos minutos.",
});

// Contra adivinar contraseñas: solo cuentan los intentos fallidos
export const loginLimiter = limiter({
  windowMs: 15 * MIN,
  limit: 10,
  skipSuccessfulRequests: true,
  mensaje: "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.",
});

export const adminLoginLimiter = limiter({
  windowMs: 15 * MIN,
  limit: 5,
  skipSuccessfulRequests: true,
  mensaje: "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo.",
});

// Contra creación masiva de cuentas falsas
export const registerLimiter = limiter({
  windowMs: 60 * MIN,
  limit: 10,
  mensaje: "Se crearon demasiadas cuentas desde esta red. Intenta más tarde.",
});

// Protege tu cuota gratuita de la IA: por CLIENTE (se usa después de requireAuth)
export const chatLimiter = limiter({
  windowMs: 10 * MIN,
  limit: 15,
  keyGenerator: (req) => req.auth.id,
  mensaje: "Enviaste muchos mensajes seguidos. Espera unos minutos o escríbenos por WhatsApp.",
});
