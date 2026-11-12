// Formato en que los pedidos salen hacia el frontend (los productos se identifican por su slug)
export const orderToPublic = (o) => ({
  id: o._id,
  items: o.items.map((i) => ({ id: i.slug, name: i.name, price: i.price, qty: i.qty })),
  total: o.total,
  status: o.status,
  createdAt: o.createdAt,
});

// Vista del administrador: además indica a qué cliente pertenece el pedido
export const orderToAdmin = (o) => ({ ...orderToPublic(o), clientId: o.client });

export const clientToPublic = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  createdAt: u.createdAt,
});
