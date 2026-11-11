/*
 * Capa de acceso a datos. Todas las funciones son async y devuelven datos "limpios".
 * Hoy simulan el servidor con localStorage; cuando exista el backend, solo se
 * reemplaza el interior de cada función por un fetch(`${import.meta.env.VITE_API_URL}/...`)
 * con el token en la cabecera Authorization. Los componentes no cambian.
 *
 * En el backend real: el clientId sale del token (no del frontend), y los precios
 * y totales los calcula el servidor.
 */
import { products } from "../data/products";
import { answer } from "./assistant";

const KEY = "auraluz-db";
const SESSION = "auraluz-sesion";
const ADMIN = { email: "admin@auraluz.com", password: "admin123", name: "Administrador" };

async function hash(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { clients: [], orders: [] };
  } catch {
    return { clients: [], orders: [] };
  }
}
const write = (db) => localStorage.setItem(KEY, JSON.stringify(db));
const currentUser = () => {
  try { return JSON.parse(localStorage.getItem(SESSION)); } catch { return null; }
};
const requireRole = (role) => {
  const u = currentUser();
  if (!u || u.role !== role) throw new Error("No autorizado.");
  return u;
};

/* ---------- Autenticación ---------- */
export async function login(role, email, password) {
  email = email.trim().toLowerCase();
  if (role === "admin") {
    return email === ADMIN.email && password === ADMIN.password
      ? { role: "admin", id: "admin", name: ADMIN.name, token: "demo" }
      : null;
  }
  const c = read().clients.find((c) => c.email === email);
  if (c && c.passwordHash === (await hash(password))) {
    return { role: "cliente", id: c.id, name: c.name, token: "demo" };
  }
  return null;
}

/* Registro hecho por el propio cliente */
export async function registerClient({ name, email, phone, password }) {
  const db = read();
  email = email.trim().toLowerCase();
  if (db.clients.some((c) => c.email === email)) {
    throw new Error("Ya existe una cuenta con ese correo.");
  }
  db.clients.push({
    id: crypto.randomUUID(),
    name: name.trim(),
    email,
    phone: phone.trim(),
    passwordHash: await hash(password),
    createdAt: new Date().toISOString(),
  });
  write(db);
}

/* ---------- Pedidos del cliente ---------- */
export async function createOrder(items) {
  const u = requireRole("cliente");
  const db = read();
  const lines = items.map(({ id, qty }) => {
    const p = products.find((p) => p.id === id);
    if (!p || qty < 1) throw new Error("Producto inválido.");
    return { id, name: p.name, price: p.price, qty };
  });
  db.orders.unshift({
    id: crypto.randomUUID(),
    clientId: u.id,
    items: lines,
    total: lines.reduce((s, i) => s + i.price * i.qty, 0),
    status: "pendiente",
    createdAt: new Date().toISOString(),
  });
  write(db);
}

/* ---------- Administrador (solo lectura + estado) ---------- */
export async function getDashboard() {
  requireRole("admin");
  const db = read();
  const clients = db.clients.map(({ passwordHash, ...c }) => c);
  return { clients, orders: db.orders };
}

export async function updateOrderStatus(id, status) {
  requireRole("admin");
  const db = read();
  const o = db.orders.find((o) => o.id === id);
  if (o) o.status = status;
  write(db);
}

/* ---------- Chat del asistente ----------
 * Backend real: POST /api/chat con { messages } y el token del cliente.
 * El servidor busca los pedidos de ESE cliente, arma el prompt (FAQ + historial),
 * llama a la IA y devuelve { reply, suggestions: [idsDeProducto] }.
 * El frontend nunca envía pedidos ni datos personales: solo la conversación.
 */
export async function sendChatMessage(messages) {
  const u = requireRole("cliente");
  const last = [...messages].reverse().find((m) => m.role === "user");
  const orders = read().orders.filter((o) => o.clientId === u.id);
  await new Promise((r) => setTimeout(r, 500)); // simula la espera del servidor
  return answer(last?.content ?? "", orders, u.name);
}
