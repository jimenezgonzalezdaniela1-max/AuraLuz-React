import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLive } from "../hooks/useLive";
import { getDashboard, updateOrderStatus } from "../services/api";
import { LOGO } from "../data/config";
import { formatPrice } from "../utils/format";
import ProductsTab from "../components/admin/ProductsTab";

const STATUS = ["pendiente", "pagado", "entregado"];
const fecha = (iso) => new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("pedidos");
  const { data, loading, error, reload } = useLive(getDashboard);

  const clients = data?.clients ?? [];
  const orders = data?.orders ?? [];
  const byId = Object.fromEntries(clients.map((c) => [c.id, c]));
  const pendientes = orders.filter((o) => o.status === "pendiente").length;

  const changeStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
    } catch (err) {
      alert(err.message);
    }
    reload();
  };

  const tabs = [
    ["pedidos", `Pedidos (${orders.length})`, pendientes > 0 ? `${pendientes} pendientes` : ""],
    ["clientes", `Clientes (${clients.length})`, ""],
    ["productos", "Productos", ""],
  ];

  return (
    <>
      <header className="site-header">
        <span className="logo"><img src={LOGO} alt="" width="44" height="44" /><span>Panel Auraluz</span></span>
        <span className="user-name">{user.name}</span>
        <button className="logout-btn" onClick={() => { signOut(); navigate("/admin/login"); }}>
          Cerrar sesión
        </button>
      </header>

      <main className="admin">
        <div className="tabs" role="tablist">
          {tabs.map(([id, label, badge]) => (
            <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}>
              {label}{badge && <span className="badge">{badge}</span>}
            </button>
          ))}
        </div>
        <p className="live-note">Se actualiza automáticamente.</p>

        {tab !== "productos" && loading && <p>Cargando…</p>}
        {tab !== "productos" && error && <p className="form-status error" role="alert">{error}</p>}

        {tab === "pedidos" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Fecha</th><th>Cliente</th><th>Contacto</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {orders.map((o) => {
                  const c = byId[o.clientId];
                  return (
                    <tr key={o.id}>
                      <td>{fecha(o.createdAt)}</td>
                      <td>{c?.name ?? "(desconocido)"}</td>
                      <td>{c ? `${c.email}${c.phone ? " · " + c.phone : ""}` : "—"}</td>
                      <td>{o.items.map((i) => `${i.qty} x ${i.name}`).join(", ")}</td>
                      <td>{formatPrice(o.total)}</td>
                      <td>
                        <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
                          {STATUS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {!loading && orders.length === 0 && <tr><td colSpan="6">Aún no hay pedidos.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === "clientes" && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Registro</th><th>Pedidos</th></tr></thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td><td>{c.email}</td><td>{c.phone || "—"}</td>
                    <td>{fecha(c.createdAt)}</td>
                    <td>{orders.filter((o) => o.clientId === c.id).length}</td>
                  </tr>
                ))}
                {!loading && clients.length === 0 && <tr><td colSpan="5">Aún no hay clientes registrados.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === "productos" && <ProductsTab />}
      </main>
    </>
  );
}
