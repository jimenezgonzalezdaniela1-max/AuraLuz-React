import { useState } from "react";

const EMPTY = { nombre: "", email: "", mensaje: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [invalid, setInvalid] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setInvalid((i) => ({ ...i, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      nombre: values.nombre.trim() === "",
      email: !EMAIL_RE.test(values.email.trim()),
      mensaje: values.mensaje.trim() === "",
    };
    setInvalid(errors);

    if (Object.values(errors).some(Boolean)) {
      setStatus({ type: "error", text: "Revisa los campos marcados." });
      return;
    }

    /* Aquí iría el envío real (Formspree, EmailJS, tu backend...) */
    setStatus({ type: "ok", text: "¡Gracias! Recibimos tu mensaje y te responderemos pronto." });
    setValues(EMPTY);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h2>Escríbenos</h2>

      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        autoComplete="name"
        className={invalid.nombre ? "invalid" : ""}
        value={values.nombre}
        onChange={handleChange}
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        className={invalid.email ? "invalid" : ""}
        value={values.email}
        onChange={handleChange}
      />

      <label htmlFor="mensaje">Mensaje</label>
      <textarea
        id="mensaje"
        name="mensaje"
        rows="4"
        className={invalid.mensaje ? "invalid" : ""}
        value={values.mensaje}
        onChange={handleChange}
      />

      <button type="submit" className="btn">Enviar mensaje</button>
      <p className={`form-status ${status.type}`} role="status" aria-live="polite">
        {status.text}
      </p>
    </form>
  );
}
