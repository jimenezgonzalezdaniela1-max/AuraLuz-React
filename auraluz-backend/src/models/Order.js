import mongoose from "mongoose";

/*
 * Cada línea guarda una COPIA del nombre y precio del momento de la compra,
 * así un cambio de precio futuro no altera pedidos antiguos.
 */
const itemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1, validate: Number.isInteger },
  },
  { _id: false }
);

export const ORDER_STATUS = ["pendiente", "pagado", "entregado"];

const orderSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: {
      type: [itemSchema],
      validate: [(v) => v.length > 0, "El pedido debe tener al menos un producto"],
    },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUS, default: "pendiente", index: true },
  },
  { timestamps: true }
);

orderSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model("Order", orderSchema);
