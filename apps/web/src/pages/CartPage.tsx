import { Link } from "react-router-dom";

import { SectionHeader } from "../components/SectionHeader";
import { useCart } from "../state/cart-context";

export function CartPage() {
  const { items, cartTotal, removeItem } = useCart();

  return (
    <div className="page">
      <section className="page-section">
        <SectionHeader
          eyebrow="Shopping bag"
          title="Review your selected frames and lens combinations before checkout."
          description="Final payment is collected on delivery. Prescription details can be submitted now or shared after the order is confirmed."
        />

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Your bag is empty.</p>
            <Link className="button button-primary" to="/shop">
              Browse frames
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => (
                <article key={`${item.productId}-${item.lensPackageId ?? "frame"}`} className="cart-item">
                  <img src={item.image} alt={item.productName} />
                  <div>
                    <h3>{item.productName}</h3>
                    <p>{item.lensPackageName ?? "Frame only"}</p>
                    <span>Qty {item.quantity}</span>
                    <strong>Rs {((item.basePrice + (item.lensPrice ?? 0)) * item.quantity).toLocaleString()}</strong>
                  </div>
                  <button className="text-button" onClick={() => removeItem(item.productId, item.lensPackageId)}>
                    Remove
                  </button>
                </article>
              ))}
            </div>

            <aside className="summary-card">
              <p>Order total</p>
              <strong>Rs {cartTotal.toLocaleString()}</strong>
              <span>Cash on delivery</span>
              <Link className="button button-primary" to="/checkout">
                Continue to COD checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
