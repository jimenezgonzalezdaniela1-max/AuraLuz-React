# Auraluz backend (Node + Express + MongoDB)

## Parte 1: proyecto base
    npm install
    cp .env.example .env     # y edita MONGODB_URI
    npm run dev
    # Prueba: http://localhost:4000/api/health

## Estructura
src/config        variables de entorno y conexión a MongoDB
src/models        modelos de Mongoose (Parte 2)
src/routes        rutas de la API
src/controllers   lógica de cada ruta
src/middlewares   autenticación, validación, errores
src/services      lógica de negocio (IA, pedidos…)
src/scripts       scripts de una sola vez (semilla de datos)
