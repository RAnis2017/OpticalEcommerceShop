import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ProductCategory } from "@optical/shared";

import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { getProducts } from "../lib/api";
import { useCart } from "../state/cart-context";

const categories: Array<{ label: string; value: ProductCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Eyeglasses", value: "eyeglasses" },
  { label: "Sunglasses", value: "sunglasses" },
];

export function ShopPage() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const { addItem, getProductQuantity } = useCart();
  const { data, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () => getProducts(category),
  });

  return (
    <div className="page">
      <section className="page-section">
        <SectionHeader
          eyebrow="Shop"
          title="Frames ready for everyday wear, prescription fitting, and select home try-on."
          description="Browse optical frames and sun styles, then choose your lens package during the order flow."
        />

        <div className="shop-toolbar">
          <div className="shop-banner">
            <strong>{data?.products.length ?? 0} styles available</strong>
            <span>Eligible frames can also be added to your home try-on shortlist.</span>
          </div>

          <div className="filter-row">
            {categories.map((item) => (
              <button
                key={item.value}
                className={category === item.value ? "chip is-active" : "chip"}
                onClick={() => setCategory(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading || !data ? (
          <div className="loading-panel">Loading products...</div>
        ) : (
          <div className="product-grid">
            {data.products.map((product) => {
              const soldOut = getProductQuantity(product.id) >= product.saleStock;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  action={
                    <button
                      type="button"
                      className="mini-button"
                      disabled={soldOut}
                      onClick={() =>
                        addItem({
                          productId: product.id,
                          productSlug: product.slug,
                          productName: product.name,
                          image: product.images[0],
                          quantity: 1,
                          stockAvailable: product.saleStock,
                          basePrice: product.price,
                          requiresPrescription: product.prescriptionSupported,
                        })
                      }
                    >
                      {soldOut ? "Sold out" : "Add to bag"}
                    </button>
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
