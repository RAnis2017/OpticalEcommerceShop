import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { createTryOn, getProducts, getStorefront } from "../lib/api";
import { useTryOn } from "../state/try-on-context";

export function TryAtHomePage() {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    preferredSlot: "",
    notes: "",
  });
  const { clearSelection, isSelected, selectedCount, selectedIds, toggleSelection } = useTryOn();

  const storefrontQuery = useQuery({
    queryKey: ["storefront"],
    queryFn: getStorefront,
  });

  const productsQuery = useQuery({
    queryKey: ["products", "try-on"],
    queryFn: () => getProducts("all", "try-on"),
  });

  const mutation = useMutation({
    mutationFn: createTryOn,
    onSuccess: () => {
      clearSelection();
      setForm({
        customerName: "",
        phone: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        preferredSlot: "",
        notes: "",
      });
    },
  });

  const minimumFrames = storefrontQuery.data?.homeTryOn.minimumFrames ?? 10;
  const serviceFee = storefrontQuery.data?.homeTryOn.serviceFee ?? 500;

  const remainingCount = useMemo(() => Math.max(0, minimumFrames - selectedCount), [minimumFrames, selectedCount]);
  const selectedProducts = useMemo(
    () => productsQuery.data?.products.filter((product) => selectedIds.includes(product.id)) ?? [],
    [productsQuery.data?.products, selectedIds],
  );
  const canSubmit =
    selectedCount >= minimumFrames &&
    form.customerName.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.addressLine1.trim() &&
    form.preferredSlot.trim();

  if (productsQuery.isLoading || !productsQuery.data) {
    return <section className="page loading-panel">Loading try-at-home frames...</section>;
  }

  return (
    <div className="page">
      <section className="page-section">
        <SectionHeader
          eyebrow="Home try-on"
          title="Shortlist your frames, try them at home, then confirm the one you want fitted."
          description={`Choose at least ${minimumFrames} eligible frames. The home try-on service is Rs ${serviceFee} and is collected on delivery.`}
        />

        <div className="try-on-banner">
          <div>
            <strong>{selectedCount}</strong>
            <span>frames selected</span>
          </div>
          <div>
            <strong>Rs {serviceFee}</strong>
            <span>service fee on delivery</span>
          </div>
          <div>
            <strong>{remainingCount === 0 ? "Ready" : `${remainingCount} more`}</strong>
            <span>to unlock request</span>
          </div>
        </div>
      </section>

      <section className="try-on-layout">
        <div className="product-grid">
          {productsQuery.data.products.map((product) => {
            const selected = isSelected(product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                action={
                  <button
                    className={selected ? "mini-button is-selected" : "mini-button"}
                    onClick={() => toggleSelection(product.id)}
                  >
                    {selected ? "Selected" : "Add to shortlist"}
                  </button>
                }
              />
            );
          })}
        </div>

        <aside className="form-panel try-on-side-panel">
          <div className="selected-summary-header">
            <div>
              <h3>Your shortlist</h3>
              <p>{selectedCount} frame(s) selected for home try-on.</p>
            </div>
            {selectedCount > 0 ? (
              <button className="text-button" type="button" onClick={clearSelection}>
                Clear
              </button>
            ) : null}
          </div>

          <div className="selected-frame-list">
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product) => (
                <article key={product.id} className="selected-frame-card">
                  <img src={product.images[0]} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>Rs {product.price.toLocaleString()}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state compact-empty">
                <p>Select frames to start building your home try-on set.</p>
              </div>
            )}
          </div>

          <h3>Schedule delivery</h3>
          <div className="form-grid">
            <label>
              Name
              <input value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </label>
            <label>
              City
              <input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
            </label>
            <label>
              Preferred slot
              <input value={form.preferredSlot} onChange={(event) => setForm((current) => ({ ...current, preferredSlot: event.target.value }))} />
            </label>
            <label className="full-span">
              Address line 1
              <input value={form.addressLine1} onChange={(event) => setForm((current) => ({ ...current, addressLine1: event.target.value }))} />
            </label>
            <label className="full-span">
              Address line 2
              <input value={form.addressLine2} onChange={(event) => setForm((current) => ({ ...current, addressLine2: event.target.value }))} />
            </label>
            <label className="full-span">
              Notes
              <textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </label>
          </div>

          <button
            className="button button-primary"
            disabled={!canSubmit || mutation.isPending}
            onClick={() => mutation.mutate({ ...form, selectedFrameIds: selectedIds })}
          >
            {mutation.isPending
              ? "Scheduling..."
              : canSubmit
                ? "Confirm home try-on"
                : `Select ${minimumFrames} frames and complete details`}
          </button>

          {mutation.isError ? <p className="inline-error">{mutation.error.message}</p> : null}
          {mutation.isSuccess ? (
            <div className="success-panel">
              <strong>Home try-on booked</strong>
              <p>Reference {mutation.data.request.id}. Our team will confirm the slot and dispatch your selected frames.</p>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
