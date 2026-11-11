# Auraluz (React + Vite)

    npm install
    npm run dev

## Accesos
- Cliente:        /login  y  /registro  (el cliente crea su propia cuenta)
- Administrador:  /admin/login  -> admin@auraluz.com / admin123  (cámbialo en src/services/db.js)

## Imágenes de productos (public/img/)
rosa.jpg, girasol.jpg, campana-amarilla.jpg, margarita.jpg

## Asistente de chat (recomendaciones + preguntas frecuentes)
- Hoy responde con lógica local (`src/services/assistant.js`) usando los pedidos del cliente y `src/data/faq.js`.
- Con el backend: `POST /api/chat` -> el servidor toma el cliente del token, lee SUS pedidos,
  arma el prompt (FAQ + historial, sin nombre/correo/teléfono) y llama a la IA (p. ej. Gemini, capa gratuita).
  La API key va SOLO en el servidor (variable de entorno), nunca en React.
