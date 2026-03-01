import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LensPackage } from "@optical/shared";
import { useParams } from "react-router-dom";

import { getLensPackages, getProduct } from "../lib/api";
import { useCart } from "../state/cart-context";
import { useTryOn } from "../state/try-on-context";

export function ProductPage() {
  const { slug = "" } = useParams();
  const { addItem } = useCart();
  const { isSelected, toggleSelection } = useTryOn();
  const [selectedLens, setSelectedLens] = useState<string>("frame-only");
  const [activeImage, setActiveImage] = useState<string>("");
  const [message, setMessage] = useState("");

  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  const lensPackagesQuery = useQuery({
    queryKey: ["lens-packages"],
    queryFn: getLensPackages,
  });

  const lensPackages = lensPackagesQuery.data?.lensPackages ?? [];
  const product = productQuery.data?.product;

  useEffect(() => {
    if (product?.images[0]) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  if (productQuery.isLoading || !product) {
    return <section className="page loading-panel">Loading product...</section>;
  }

  const selectedLensPackage: LensPackage | undefined =
    selectedLens === "frame-only"
      ? undefined
      : lensPackages.find((lensPackage) => lensPackage.id === selectedLens);

  return (
    <div className="page">
      <section className="product-detail">
        <div className="product-detail-media">
          <div className="product-gallery-frame">
            <img src={activeImage || product.images[0]} alt={product.name} />
          </div>
          <div className="product-gallery-strip">
            {product.images.map((image, index) => (
              <button
                key={`${product.id}-${index}`}
                type="button"
                className={activeImage === image ? "gallery-thumb is-active" : "gallery-thumb"}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="product-subtitle">{product.subtitle}</p>
          <div className="price-row">
            <strong className="product-price">Rs {product.price.toLocaleString()}</strong>
            {product.compareAtPrice ? <span className="compare-price">Rs {product.compareAtPrice.toLocaleString()}</span> : null}
          </div>
          <p>{product.description}</p>

          <div className="product-color-row">
            {product.colors.map((color) => (
              <span key={color} className="color-chip">
                {color}
              </span>
            ))}
          </div>

          <div className="spec-grid">
            <div>
              <span>Material</span>
              <strong>{product.material}</strong>
            </div>
            <div>
              <span>Shape</span>
              <strong>{product.shape}</strong>
            </div>
            <div>
              <span>Measurements</span>
              <strong>
                {product.measurement.lensWidth} - {product.measurement.bridgeWidth} - {product.measurement.templeLength}
              </strong>
            </div>
            <div>
              <span>Home try-on</span>
              <strong>{product.tryOnEligible ? "Available for shortlist" : "Exclusive to direct order"}</strong>
            </div>
          </div>

          <div className="lens-picker">
            <label htmlFor="lensPackage">Lens package</label>
            <select
              id="lensPackage"
              value={selectedLens}
              onChange={(event) => setSelectedLens(event.target.value)}
            >
              <option value="frame-only">Frame only</option>
              {lensPackages.map((lensPackage) => (
                <option key={lensPackage.id} value={lensPackage.id}>
                  {lensPackage.name} (+ Rs {lensPackage.price.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="detail-actions">
            <button
              className="button button-primary"
              onClick={() => {
                addItem({
                  productId: product.id,
                  productSlug: product.slug,
                  productName: product.name,
                  image: product.images[0],
                  quantity: 1,
                  basePrice: product.price,
                  lensPackageId: selectedLensPackage?.id,
                  lensPackageName: selectedLensPackage?.name,
                  lensPrice: selectedLensPackage?.price,
                  requiresPrescription: product.prescriptionSupported,
                });
                setMessage("Added to your bag.");
              }}
            >
              Add to bag
            </button>
            {product.tryOnEligible ? (
              <button
                className={isSelected(product.id) ? "button button-secondary is-selected" : "button button-secondary"}
                onClick={() => {
                  toggleSelection(product.id);
                  setMessage(
                    isSelected(product.id)
                      ? "Removed from your home try-on shortlist."
                      : "Added to your home try-on shortlist.",
                  );
                }}
              >
                {isSelected(product.id) ? "Shortlisted" : "Add to home try-on"}
              </button>
            ) : null}
          </div>

          {message ? <p className="inline-success">{message}</p> : null}

          <ul className="feature-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
