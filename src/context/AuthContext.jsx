import { createContext, useContext, useState } from "react";
import { login } from "../services/api";

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

  const signIn = async (role, email, password) => {
    const u = await login(role, email, password);
    if (!u) return false;
    localStorage.setItem(SESSION, JSON.stringify(u));
    setUser(u);
    return true;
  };

  const signOut = () => {
    localStorage.removeItem(SESSION);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
