import { Link } from "react-router-dom";

import { SectionHeader } from "../components/SectionHeader";
import { useCart } from "../state/cart-context";

export function CartPage() {
  const { items, cartTotal, getProductQuantity, removeItem, updateItemQuantity } = useCart();

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
              {items.map((item) => {
                const unitPrice = item.basePrice + (item.lensPrice ?? 0);
                const quantityReservedElsewhere = getProductQuantity(item.productId) - item.quantity;
                const maxQuantityForLine = Math.max(item.stockAvailable - quantityReservedElsewhere, 0);
                const remainingStock = Math.max(maxQuantityForLine - item.quantity, 0);

                return (
                  <article key={`${item.productId}-${item.lensPackageId ?? "frame"}`} className="cart-item">
                    <img src={item.image} alt={item.productName} />

                    <div className="cart-item-body">
                      <div className="cart-item-header">
                        <div>
                          <h3>{item.productName}</h3>
                          <p>{item.lensPackageName ?? "Frame only"}</p>
                          <span className="detail-helper">
                            {remainingStock > 0
                              ? `${remainingStock} more available`
                              : "You have reached the stock limit for this frame"}
                          </span>
                        </div>
                        <strong>Rs {(unitPrice * item.quantity).toLocaleString()}</strong>
                      </div>

                      <div className="cart-item-footer">
                        <div className="cart-item-controls">
                          <div className="quantity-stepper">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateItemQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity - 1,
                                  lensPackageId: item.lensPackageId,
                                })
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateItemQuantity({
                                  productId: item.productId,
                                  quantity: item.quantity + 1,
                                  lensPackageId: item.lensPackageId,
                                })
                              }
                              disabled={item.quantity >= maxQuantityForLine}
                            >
                              +
                            </button>
                          </div>
                          <span className="detail-helper">Rs {unitPrice.toLocaleString()} each</span>
                        </div>

                        <button
                          type="button"
                          className="text-button"
                          onClick={() => removeItem(item.productId, item.lensPackageId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
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
