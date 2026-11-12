import { createContext, useContext, useEffect, useState } from "react";
import { login } from "../services/api";
import { STORAGE_KEY } from "../data/config";

const SESSION = "auraluz-sesion";
const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION));
    } catch {
      return null;
    }
  });

  // api.js avisa cuando el servidor responde que la sesión venció
  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener("auraluz:logout", onLogout);
    return () => window.removeEventListener("auraluz:logout", onLogout);
  }, []);

  // Devuelve true/false según las credenciales; si hay otro error (red, límite de intentos) lo lanza
  const signIn = async (role, email, password) => {
    const u = await login(role, email, password);
    if (!u) return false;
    localStorage.setItem(SESSION, JSON.stringify(u));
    setUser(u);
    return true;
  };

  const signOut = () => {
    localStorage.removeItem(SESSION);
    localStorage.removeItem(STORAGE_KEY); // el carrito no pasa a la siguiente persona
    setUser(null);
  };

  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
