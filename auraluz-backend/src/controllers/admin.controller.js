import mongoose from "mongoose";
import Order, { ORDER_STATUS } from "../models/Order.js";
import User from "../models/User.js";
import { HttpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { clientToPublic, orderToAdmin } from "../utils/serializers.js";

const MAX_CLIENTS = 1000;
const MAX_ORDERS = 500;

const loadClients = async () =>
  (await User.find({ role: "cliente" }).sort({ createdAt: -1 }).limit(MAX_CLIENTS).lean()).map(clientToPublic);

const loadOrders = async (filter = {}) =>
  (await Order.find(filter).sort({ createdAt: -1 }).limit(MAX_ORDERS).lean()).map(orderToAdmin);

// Todo lo que muestra el panel en una sola petición (el frontend la refresca cada pocos segundos)
export const dashboard = asyncHandler(async (req, res) => {
  const [clients, orders] = await Promise.all([loadClients(), loadOrders()]);
  res.json({ clients, orders });
});

export const listClients = asyncHandler(async (req, res) => {
  res.json({ clients: await loadClients() });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status !== undefined) {
    // Solo texto permitido: evita que se cuelen operadores de MongoDB como status[$ne]=x
    if (typeof status !== "string" || !ORDER_STATUS.includes(status)) {
      throw new HttpError(400, `Estado inválido. Usa: ${ORDER_STATUS.join(", ")}.`);
    }
    filter.status = status;
  }
  res.json({ orders: await loadOrders(filter) });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body ?? {};
  if (typeof status !== "string" || !ORDER_STATUS.includes(status)) {
    throw new HttpError(400, `Estado inválido. Usa: ${ORDER_STATUS.join(", ")}.`);
  }
  if (!mongoose.isValidObjectId(req.params.id)) throw new HttpError(404, "Pedido no encontrado.");

  const order = await Order.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true });
  if (!order) throw new HttpError(404, "Pedido no encontrado.");

  res.json({ order: orderToAdmin(order) });
});
