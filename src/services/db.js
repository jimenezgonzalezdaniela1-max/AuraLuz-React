/*
 * "Base de datos" de DEMOSTRACIÓN: guarda todo en localStorage del navegador.
 * No es segura (cualquiera con acceso al navegador puede leer o editar los datos).
 * Para producción, reemplaza estas funciones por llamadas a tu backend (mismos nombres).
 */
const KEY = "auraluz-db";
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

export async function login(role, email, password) {
  email = email.trim().toLowerCase();
  if (role === "admin") {
    return email === ADMIN.email && password === ADMIN.password
      ? { role: "admin", id: "admin", name: ADMIN.name }
      : null;
  }
  const c = read().clients.find((c) => c.email === email);
  if (c && c.passwordHash === (await hash(password))) {
    return { role: "cliente", id: c.id, name: c.name };
  }
  return null;
}

export const getClients = () =>
  read().clients.map(({ passwordHash, ...c }) => c);

export async function addClient({ name, email, phone, password }) {
  const db = read();
  email = email.trim().toLowerCase();
  if (db.clients.some((c) => c.email === email)) {
    throw new Error("Ya existe un cliente con ese correo.");
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

export const getOrders = () => read().orders;

export function addOrder({ clientId, items, source = "admin" }) {
  const db = read();
  db.orders.unshift({
    id: crypto.randomUUID(),
    clientId,
    items,
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    status: "pendiente",
    source,
    createdAt: new Date().toISOString(),
  });
  write(db);
}

export function updateOrderStatus(id, status) {
  const db = read();
  const o = db.orders.find((o) => o.id === id);
  if (o) o.status = status;
  write(db);
}
