import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { orderToPublic } from "../utils/serializers.js";

const MAX_LINES = 20;
const MAX_QTY = 50;

/*
 * El cliente solo manda QUÉ quiere: [{ id: "rosa", qty: 2 }].
 * Nombres, precios y total los pone el servidor con los datos de la base de datos.
 */
export const createOrder = asyncHandler(async (req, res) => {
  const raw = req.body?.items;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_LINES) {
    throw new HttpError(400, `El pedido debe tener entre 1 y ${MAX_LINES} productos.`);
  }

  // Valida cada línea y junta las repetidas (rosa x1 + rosa x2 = rosa x3)
  const qtyBySlug = new Map();
  for (const it of raw) {
    if (!it || typeof it.id !== "string" || !Number.isInteger(it.qty) || it.qty < 1) {
      throw new HttpError(400, "Producto o cantidad inválidos.");
    }
    qtyBySlug.set(it.id, (qtyBySlug.get(it.id) || 0) + it.qty);
  }
  if ([...qtyBySlug.values()].some((q) => q > MAX_QTY)) {
    throw new HttpError(400, `Máximo ${MAX_QTY} unidades por producto. Escríbenos para pedidos grandes.`);
  }

  if (!(await User.exists({ _id: req.auth.id, role: "cliente" }))) {
    throw new HttpError(401, "Sesión inválida.");
  }

  const products = await Product.find({ slug: { $in: [...qtyBySlug.keys()] }, active: true });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const items = [...qtyBySlug].map(([slug, qty]) => {
    const p = bySlug.get(slug);
    if (!p) throw new HttpError(400, "Uno de los productos ya no está disponible.");
    return { product: p._id, slug: p.slug, name: p.name, price: p.price, qty };
  });
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await Order.create({ client: req.auth.id, items, total });
  res.status(201).json({ order: orderToPublic(order) });
});

// Los pedidos del cliente que tiene la sesión iniciada (nunca los de otros)
export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ client: req.auth.id }).sort({ createdAt: -1 }).limit(100);
  res.json({ orders: orders.map(orderToPublic) });
});
