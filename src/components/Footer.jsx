import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="footer-info">
        <h2>Contacto</h2>
        <ul>
          <li>Correo: <a href="mailto:hola@floraluz.com">hola@floraluz.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/573244804156">+57 324 480 4156</a></li>
          <li>
            Instagram:{" "}
            <a href="https://instagram.com/floraluz" target="_blank" rel="noopener noreferrer">
              @floraluz
            </a>
          </li>
          <li>Barranquilla, Colombia</li>
        </ul>
      </div>

      <ContactForm />

      <p className="copyright">&copy; 2026 Flora Luz. Todos los derechos reservados.</p>
    </footer>
  );
}
