import { formatPrice } from "../utils/format";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product">
      <img src={product.image} alt={product.alt} loading="lazy" />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p className="price">{formatPrice(product.price)}</p>
      <button className="btn add-to-cart" type="button" onClick={() => onAdd(product)}>
        Agregar al carrito
      </button>
    </article>
  );
}
