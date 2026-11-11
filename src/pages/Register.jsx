import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerClient } from "../services/api";
import { LOGO } from "../data/config";

export default function Register() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await registerClient(f);
      await signIn("cliente", f.email, f.password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <img src={LOGO} alt="Logo de Auraluz" width="72" height="72" />
        <h1>Crear cuenta</h1>
        <p>Regístrate para hacer tus pedidos.</p>

        <label htmlFor="name">Nombre</label>
        <input id="name" name="name" required autoComplete="name" value={f.name} onChange={set} />
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" name="email" type="email" required autoComplete="email" value={f.email} onChange={set} />
        <label htmlFor="phone">Teléfono</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" value={f.phone} onChange={set} />
        <label htmlFor="password">Contraseña (mínimo 6 caracteres)</label>
        <input id="password" name="password" type="password" required minLength={6}
          autoComplete="new-password" value={f.password} onChange={set} />

        <button className="btn" type="submit" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}</button>
        <p className="form-status error" role="alert">{error}</p>
        <Link to="/login">Ya tengo cuenta</Link>
      </form>
    </main>
  );
}
