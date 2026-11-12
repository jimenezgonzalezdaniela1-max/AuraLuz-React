import { useState } from "react";
import { useLive } from "../../hooks/useLive";
import { assetUrl, createProduct, getAdminProducts, updateProduct, uploadImage } from "../../services/api";

const EMPTY = { title: "", description: "", price: "", image: "" };
const MAX_BYTES = 2 * 1024 * 1024;

function Row({ p, reload }) {
  const [price, setPrice] = useState(String(p.price));
  const [err, setErr] = useState("");

  const save = async (changes) => {
    setErr("");
    try {
      await updateProduct(p.id, changes);
      reload();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <tr>
      <td>{p.image ? <img className="thumb" src={assetUrl(p.image)} alt="" /> : "—"}</td>
      <td>{p.title}<br /><small>{p.id}</small></td>
      <td>
        <input className="price-input" type="number" min="0" step="1" value={price}
          onChange={(e) => setPrice(e.target.value)} aria-label={`Precio de ${p.title}`} />{" "}
        <button className="btn-mini" disabled={Number(price) === p.price || price === ""}
          onClick={() => save({ price: Number(price) })}>Guardar</button>
        {err && <small className="form-status error" role="alert"> {err}</small>}
      </td>
      <td>
        <label>
          <input type="checkbox" checked={p.active} onChange={(e) => save({ active: e.target.checked })} />{" "}
          {p.active ? "Visible" : "Oculta"}
        </label>
      </td>
    </tr>
  );
}

export default function ProductsTab() {
  const { data, loading, error, reload } = useLive(getAdminProducts, 10000);
  const [f, setF] = useState(EMPTY);
  const [fileKey, setFileKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const set = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const pickImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setMsg({ type: "error", text: "La imagen supera el máximo de 2 MB." });
      return;
    }
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      const { url } = await uploadImage(file);
      setF((prev) => ({ ...prev, image: url }));
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
    setBusy(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: "", text: "" });
    try {
      await createProduct({ title: f.title, description: f.description, price: Number(f.price), image: f.image });
      setF(EMPTY);
      setFileKey((k) => k + 1);
      setMsg({ type: "ok", text: "Producto agregado al catálogo." });
      reload();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    }
    setBusy(false);
  };

  const products = data ?? [];

  return (
    <>
      <form className="admin-form" onSubmit={submit}>
        <h2>Agregar producto</h2>
        <input name="title" placeholder="Nombre de la flor (ej.: Lavanda)" required maxLength={60}
          value={f.title} onChange={set} />
        <input name="description" placeholder="Descripción / aroma" maxLength={300}
          value={f.description} onChange={set} />
        <input name="price" type="number" min="0" step="1" placeholder="Precio en pesos" required
          value={f.price} onChange={set} />
        <label>
          Imagen (JPG, PNG o WebP, máx. 2 MB)
          <input key={fileKey} type="file" accept="image/jpeg,image/png,image/webp" onChange={pickImage} />
        </label>
        {f.image && <img className="thumb big" src={assetUrl(f.image)} alt="Vista previa" />}
        <button className="btn" type="submit" disabled={busy}>{busy ? "Procesando…" : "Agregar al catálogo"}</button>
        <p className={`form-status ${msg.type}`} role="status">{msg.text}</p>
      </form>

      {loading && <p>Cargando…</p>}
      {error && <p className="form-status error" role="alert">{error}</p>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Imagen</th><th>Producto</th><th>Precio</th><th>Estado</th></tr></thead>
          <tbody>
            {products.map((p) => <Row key={p.id + p.price + p.active} p={p} reload={reload} />)}
            {!loading && products.length === 0 && <tr><td colSpan="4">Aún no hay productos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
