import { useState } from "react";
import { WHATSAPP } from "../data/config";
import { formatPrice } from "../utils/format";
import { createOrder } from "../services/api";

export default function Cart({ open, onClose, cart }) {
  const { items, changeQty, remove, clear, total } = cart;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const checkout = async () => {
    if (items.length === 0 || busy) return;
    setBusy(true);
    setError("");

    // Abrir la pestaña ya (evita bloqueo de ventanas emergentes) y rellenarla al guardar
    const win = window.open("", "_blank");
    try {
      await createOrder(items.map(({ id, qty }) => ({ id, qty })));
    } catch (err) {
      win?.close();
      setError(err.message || "No se pudo registrar el pedido.");
      setBusy(false);
      return;
    }

    const lines = items.map((i) => `• ${i.qty} x ${i.name} - ${formatPrice(i.price * i.qty)}`);
    const message =
      "Hola, quiero hacer este pedido:\n" + lines.join("\n") + "\nTotal: " + formatPrice(total);
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
    if (win) { win.opener = null; win.location.href = url; } else { window.location.href = url; }

    clear();
    setBusy(false);
  };

  return (
    <>
      <div className="overlay" hidden={!open} onClick={onClose} />
      <aside
        className={`cart ${open ? "open" : ""}`}
        aria-label="Carrito de compras"
        aria-hidden={!open}
      >
        <div className="cart-header">
          <h2>Tu carrito</h2>
          <button type="button" aria-label="Cerrar carrito" onClick={onClose}>
            &times;
          </button>
        </div>

        <ul className="cart-items">
          {items.map((item) => (
            <li className="cart-item" key={item.id}>
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>
              <div className="cart-item-qty">
                <button
                  type="button"
                  aria-label={`Quitar una unidad de ${item.name}`}
                  onClick={() => changeQty(item.id, -1)}
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  type="button"
                  aria-label={`Agregar una unidad de ${item.name}`}
                  onClick={() => changeQty(item.id, 1)}
                >
                  +
                </button>
              </div>
              <button type="button" className="cart-item-remove" onClick={() => remove(item.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <p className="cart-empty" hidden={items.length > 0}>
          Tu carrito está vacío. Agrega una vela del catálogo.
        </p>

        <div className="cart-footer">
          <p className="cart-total">
            Total: <strong>{formatPrice(total)}</strong>
          </p>
          <button type="button" className="btn" disabled={items.length === 0 || busy} onClick={checkout}>
            {busy ? "Enviando…" : "Finalizar pedido"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={items.length === 0}
            onClick={clear}
          >
            Vaciar carrito
          </button>
        </div>
      </aside>
    </>
  );
}
