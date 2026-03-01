import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { getStorefront } from "../lib/api";
import { useCart } from "../state/cart-context";

export function HomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["storefront"],
    queryFn: getStorefront,
  });
  const { addItem } = useCart();

  if (isLoading || !data) {
    return <section className="page loading-panel">Loading storefront...</section>;
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Optical commerce for one brand</p>
          <h1>{data.storefront.heroTitle}</h1>
          <p>{data.storefront.heroSubtitle}</p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/shop">
              Shop frames
            </Link>
            <Link className="button button-secondary" to="/try-at-home">
              Book try-at-home
            </Link>
          </div>

          <div className="hero-points">
            {data.storefront.serviceHighlights.map((highlight) => (
              <div key={highlight} className="hero-point">
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-card">
            <p>Home try-on</p>
            <strong>
              {data.homeTryOn.minimumFrames}+ frames for Rs {data.homeTryOn.serviceFee}
            </strong>
            <span>Pick your shortlist at home, then confirm prescription fitting.</span>
          </div>
          <div className="stat-grid">
            {data.storefront.stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <SectionHeader
          eyebrow="Featured edit"
          title="Frames tuned for work, travel, and long wear."
          description="This first implementation ships with a full-stack foundation and a curated demo catalog you can extend from the admin side later."
        />

        <div className="product-grid">
          {data.featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              action={
                <button
                  className="mini-button"
                  onClick={() =>
                    addItem({
                      productId: product.id,
                      productSlug: product.slug,
                      productName: product.name,
                      image: product.images[0],
                      quantity: 1,
                      basePrice: product.price,
                      requiresPrescription: product.prescriptionSupported,
                    })
                  }
                >
                  Add to cart
                </button>
              }
            />
          ))}
        </div>
      </section>

      <section className="page-section split-panel">
        <div className="editorial-card">
          <SectionHeader
            eyebrow="Collections"
            title="Merchandise the catalog around optical use cases."
            description="The backend is already structured for frames, lenses, orders, try-on requests, and admin operations."
          />
          <div className="collection-list">
            {data.storefront.featuredCollections.map((collection) => (
              <article key={collection.id} className="collection-card">
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <Link to="/shop">Browse collection</Link>
              </article>
            ))}
          </div>
        </div>

        <div className="ops-card">
          <p className="eyebrow">Operations spine</p>
          <h3>Admin-ready flows from day one.</h3>
          <ul className="feature-list">
            <li>Cookie-protected admin login backed by the Express API</li>
            <li>Order and try-at-home submission endpoints with validation</li>
            <li>React Query data layer for storefront and operations screens</li>
          </ul>
          <Link className="button button-primary" to="/admin/login">
            Open admin access
          </Link>
        </div>
      </section>
    </div>
  );
}
