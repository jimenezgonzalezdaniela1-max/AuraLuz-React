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

## Parte 5: productos
    GET   /api/products                 catálogo público (solo activos)
    GET   /api/admin/products           todos los productos (admin)
    PATCH /api/admin/products/:slug     cambia precio, textos o active (admin)

## Parte 6: pedidos del cliente
    POST /api/orders   { items: [{ id: "rosa", qty: 2 }] }   -> { order }   (solo clientes)
    GET  /api/orders                                          -> { orders } (solo los del cliente)

## Parte 7: panel del administrador (solo rol admin)
    GET   /api/admin/dashboard            { clients, orders }  (lo que usa el panel)
    GET   /api/admin/clients              clientes registrados
    GET   /api/admin/orders?status=...    pedidos (filtro opcional)
    PATCH /api/admin/orders/:id/status    { status: "pendiente" | "pagado" | "entregado" }

## Parte 8: chat con IA
    POST /api/chat   { messages: [{ role: "user"|"assistant", content }] }
                     -> { reply, suggestions: [slugs], source: "ia" | "local" }   (solo clientes)

## Parte 9: seguridad
Helmet (cabeceras), límites de peticiones (login, registro, chat, global), rechazo de operadores NoSQL,
errores JSON uniformes y verificación del rol contra la base de datos en cada ruta protegida.

## Productos nuevos y subida de imágenes (admin)
    POST /api/admin/products   { title, description, price, image?, alt?, name?, active? }
    POST /api/admin/uploads    multipart/form-data, campo "image" (JPG/PNG/WebP, máx. 2 MB) -> { url }
Las imágenes se guardan en la carpeta uploads/ y se sirven en /uploads/...
