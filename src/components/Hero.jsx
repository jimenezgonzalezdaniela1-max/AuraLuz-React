import { LOGO } from "../data/config";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <img src={LOGO} alt="Logo de Auraluz" className="hero-logo" width="160" height="160" />
      <h1>Auraluz</h1>
      <p className="hero-text">
        Velas aromáticas hechas a mano con forma de flor. Enciende un jardín en tu hogar.
      </p>
      <a href="#catalogo" className="btn">Ver catálogo</a>
    </section>
  );
}
