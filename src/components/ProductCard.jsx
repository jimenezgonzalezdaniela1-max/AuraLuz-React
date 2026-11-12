import { formatPrice } from "../utils/format";
import { assetUrl } from "../services/api";

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product">
      {product.image ? (
        <img src={assetUrl(product.image)} alt={product.alt} loading="lazy" />
      ) : (
        <div className="noimg" aria-hidden="true" />
      )}
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p className="price">{formatPrice(product.price)}</p>
      <button className="btn add-to-cart" type="button" onClick={() => onAdd(product)}>
        Agregar al carrito
      </button>
    </article>
  );
}
