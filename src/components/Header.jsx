import { useState } from "react";
import { LOGO } from "../data/config";
import { useAuth } from "../context/AuthContext";

export default function Header({ cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="site-header" id="inicio-header">
      <a href="#inicio" className="logo" aria-label="Emprendimiento de Daniela, ir al inicio">
        <img src={LOGO} alt="Logo de emprendimiento" width="48" height="48" />
        <span>Auraluz</span>
      </a>

      <button
        className="nav-toggle"
        aria-label="Abrir menú"
        aria-expanded={menuOpen}
        aria-controls="menu"
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span></span><span></span><span></span>
      </button>

      <nav
        id="menu"
        className={`nav ${menuOpen ? "open" : ""}`}
        aria-label="Navegación principal"
        onClick={(e) => e.target.closest("a") && setMenuOpen(false)}
      >
        <ul>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#catalogo">Catálogo</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
      </nav>

      <button className="cart-btn" aria-label="Abrir carrito" onClick={onOpenCart}>
        Carrito <span className="cart-count">{cartCount}</span>
      </button>

      <button className="logout-btn" onClick={signOut} title={user?.name}>
        Cerrar sesión
      </button>
    </header>
  );
}
