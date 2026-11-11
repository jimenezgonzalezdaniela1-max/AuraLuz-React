import { useEffect, useState } from "react";
import { STORAGE_KEY } from "../data/config";

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* si el navegador bloquea el almacenamiento, el carrito sigue funcionando */
    }
  }, [items]);

  const add = (p) =>
    setItems((prev) =>
      prev.some((i) => i.id === p.id)
        ? prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    );

  const changeQty = (id, delta) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, add, changeQty, remove, clear, total, count };
}
