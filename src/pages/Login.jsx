import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOGO } from "../data/config";

export default function Login({ role }) {
  const isAdmin = role === "admin";
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const ok = await signIn(role, email, password);
    if (ok) navigate(isAdmin ? "/admin" : "/", { replace: true });
    else setError("Correo o contraseña incorrectos.");
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <img src={LOGO} alt="Logo de Auraluz" width="72" height="72" />
        <h1>{isAdmin ? "Administrador" : "Bienvenido"}</h1>
        <p>{isAdmin ? "Acceso al panel de gestión." : "Ingresa para ver el catálogo."}</p>

        <label htmlFor="email">Correo electrónico</label>
        <input id="email" type="email" required autoComplete="username"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn" type="submit">Iniciar sesión</button>
        <p className="form-status error" role="alert">{error}</p>

        {!isAdmin && <Link to="/registro">Crear cuenta nueva</Link>}
        <Link to={isAdmin ? "/login" : "/admin/login"}>
          {isAdmin ? "Soy cliente" : "Soy administrador"}
        </Link>
      </form>
    </main>
  );
}
