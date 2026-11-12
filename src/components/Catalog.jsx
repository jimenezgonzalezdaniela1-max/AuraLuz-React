import ProductCard from "./ProductCard";

export default function Catalog({ products, loading, error, onAdd }) {
  return (
    <section className="catalog" id="catalogo">
      <h2>Catálogo</h2>
      <p className="section-intro">Cuatro flores, cuatro aromas. Elige la que más te guste.</p>

      {loading && <p>Cargando catálogo…</p>}
      {error && <p className="form-status error" role="alert">{error}</p>}

      <div className="products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
