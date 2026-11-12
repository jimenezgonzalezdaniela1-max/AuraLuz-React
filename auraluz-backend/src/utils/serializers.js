// Formato en que los pedidos salen hacia el frontend (los productos se identifican por su slug)
export const orderToPublic = (o) => ({
  id: o._id,
  items: o.items.map((i) => ({ id: i.slug, name: i.name, price: i.price, qty: i.qty })),
  total: o.total,
  status: o.status,
  createdAt: o.createdAt,
});
