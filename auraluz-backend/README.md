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

## Parte 2: modelos y semilla
    npm install
    npm run seed     # crea los 4 productos y el administrador

## Parte 3: registro y login de clientes
    POST /api/auth/register   { name, email, phone, password }  -> { token, user }
    POST /api/auth/login      { email, password }               -> { token, user }
    GET  /api/auth/me         (Authorization: Bearer <token>)   -> { user }

## Parte 4: login de administrador y roles
    POST /api/auth/admin/login  { email, password }  -> { token, user }
    GET  /api/admin/ping        (solo rol admin)
