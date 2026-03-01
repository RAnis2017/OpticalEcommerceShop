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
      </Link>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span>{product.category}</span>
          {product.tryOnEligible ? <span>Try at home</span> : null}
        </div>
        <h3>{product.name}</h3>
        <p>{product.subtitle}</p>
        <div className="product-card-bottom">
          <strong>Rs {product.price.toLocaleString()}</strong>
          {action}
        </div>
      </div>
    </article>
  );
}
