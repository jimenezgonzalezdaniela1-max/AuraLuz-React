import { useEffect, useState } from "react";
import { useCart } from "../hooks/useCart";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Catalog from "../components/Catalog";
import Cart from "../components/Cart";
import Footer from "../components/Footer";

export default function Store() {
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleAdd = (product) => {
    cart.add(product);
    setCartOpen(true);
  };

  return (
    <>
      <Header cartCount={cart.count} onOpenCart={() => setCartOpen(true)} />
      <main>
        <Hero />
        <Catalog onAdd={handleAdd} />
      </main>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} />
      <Footer />
    </>
  );
}
