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
          <p className="eyebrow">Studio Vision</p>
          <h1>{data.storefront.heroTitle}</h1>
          <p>{data.storefront.heroSubtitle}</p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/shop">
              Shop the collection
            </Link>
            <Link className="button button-secondary" to="/try-at-home">
              Build your home try-on
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
            <p>Home try-on service</p>
            <strong>
              {data.homeTryOn.minimumFrames}+ frames for Rs {data.homeTryOn.serviceFee}
            </strong>
            <span>Select the styles you want to see in person, try them at home, then place the final prescription order.</span>
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
          eyebrow="Featured frames"
          title="Everyday frames with prescription-ready lens options."
          description="Designed for daily wear, fitted for your prescription, and finished with the lens package that suits how you work, read, and move."
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
                  Add to bag
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
            title="Styles grouped around how people actually wear them."
            description="From workday rectangles to lighter titanium frames and prescription-ready sun styles, the collection is organised around fit and purpose."
          />
          <div className="collection-list">
            {data.storefront.featuredCollections.map((collection) => (
              <article key={collection.id} className="collection-card">
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <Link to="/shop">Explore frames</Link>
              </article>
            ))}
          </div>
        </div>

        <div className="ops-card">
          <p className="eyebrow">Why clients choose us</p>
          <h3>Styled at home, fitted to prescription, delivered with care.</h3>
          <ul className="feature-list">
            <li>Single vision, blue-light, and progressive lens packages</li>
            <li>Cash on delivery for both purchase and home try-on service</li>
            <li>At-home selection for eligible frames before final fitting</li>
          </ul>
          <Link className="button button-primary" to="/try-at-home">
            Start home try-on
          </Link>
        </div>
      </section>
    </div>
  );
}
