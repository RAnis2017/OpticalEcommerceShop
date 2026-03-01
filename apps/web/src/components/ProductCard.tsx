import type { ReactNode } from "react";
import type { Product } from "@optical/shared";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  action?: ReactNode;
}

export function ProductCard({ product, action }: ProductCardProps) {
  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-card-image">
        <img src={product.images[0]} alt={product.name} />
        <div className="product-card-badges">
          <span>{product.category}</span>
          {product.tryOnEligible ? <span>Try at home</span> : null}
        </div>
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span>{product.brand}</span>
          <span>{product.images.length} views</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <div className="product-card-swatches">
          {product.colors.slice(0, 3).map((color) => (
            <span key={color}>{color}</span>
          ))}
        </div>
        <div className="product-card-bottom">
          <div className="product-card-price-group">
            <strong>Rs {product.price.toLocaleString()}</strong>
            <span className="product-card-stock">
              {product.saleStock > 0 ? `${product.saleStock} ready to order` : "Currently sold out"}
            </span>
          </div>
        </div>
        {action ? <div className="product-card-actions">{action}</div> : null}
      </div>
    </article>
  );
}
