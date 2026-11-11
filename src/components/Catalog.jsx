import { products } from "../data/products";
import ProductCard from "./ProductCard";

export default function Catalog({ onAdd }) {
  return (
    <section className="catalog" id="catalogo">
      <h2>Catálogo</h2>
      <p className="section-intro">Cuatro flores, cuatro aromas. Elige la que más te guste.</p>

      <div className="products">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}
