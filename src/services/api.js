/*
 * Capa de acceso a datos: habla con el backend (auraluz-backend).
 * Los componentes solo usan estas funciones; ninguno llama a fetch directamente.
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const SESSION = "auraluz-sesion";

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION));
  } catch {
    return null;
  }
};

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  const isForm = body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";
  const session = getSession();
  if (auth && session?.token) headers.Authorization = `Bearer ${session.token}`;

  let res;
  try {
    res = await fetch(API_URL + path, { method, headers, body: !body ? undefined : isForm ? body : JSON.stringify(body) });
  } catch {
    throw new Error("No se pudo conectar con el servidor. ¿Está encendido el backend?");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Sesión vencida o inválida: se cierra la sesión local
    if (res.status === 401 && auth && session?.token) {
      localStorage.removeItem(SESSION);
      window.dispatchEvent(new Event("auraluz:logout"));
    }
    const err = new Error(data.error || `Error ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

/* ---------- Autenticación ---------- */
// Devuelve la sesión { role, id, name, token }, o null si las credenciales son incorrectas
export async function login(role, email, password) {
  try {
    const path = role === "admin" ? "/auth/admin/login" : "/auth/login";
    const { token, user } = await request(path, { method: "POST", body: { email, password }, auth: false });
    return { role: user.role, id: user.id, name: user.name, token };
  } catch (err) {
    if (err.status === 401) return null;
    throw err;
  }
}

export const registerClient = ({ name, email, phone, password }) =>
  request("/auth/register", { method: "POST", body: { name, email, phone, password }, auth: false });

/* ---------- Catálogo ---------- */
export const getProducts = async () => (await request("/products", { auth: false })).products;

/* ---------- Pedidos del cliente ---------- */
// Solo se envía qué y cuánto: el servidor pone precios y total
export const createOrder = (items) => request("/orders", { method: "POST", body: { items } });

/* ---------- Administrador ---------- */
export const getDashboard = () => request("/admin/dashboard");

export const updateOrderStatus = (id, status) =>
  request(`/admin/orders/${id}/status`, { method: "PATCH", body: { status } });

/* ---------- Chat ---------- */
export const sendChatMessage = (messages) => request("/chat", { method: "POST", body: { messages } });

/* ---------- Productos (administrador) ---------- */
export const getAdminProducts = async () => (await request("/admin/products")).products;

export const createProduct = async (data) =>
  (await request("/admin/products", { method: "POST", body: data })).product;

export const updateProduct = async (slug, changes) =>
  (await request(`/admin/products/${slug}`, { method: "PATCH", body: changes })).product;

export function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  return request("/admin/uploads", { method: "POST", body: form }); // -> { url }
}

// Las imágenes subidas viven en el backend; las demás (/img/...) en este proyecto
export const assetUrl = (path) =>
  path && path.startsWith("/uploads/") ? API_URL.replace(/\/api\/?$/, "") + path : path;
