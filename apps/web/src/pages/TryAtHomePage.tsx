import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { createTryOn, getProducts, getStorefront } from "../lib/api";

export function TryAtHomePage() {
  const [selectedFrames, setSelectedFrames] = useState<string[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    preferredSlot: "",
    notes: "",
  });

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
  });

  const minimumFrames = storefrontQuery.data?.homeTryOn.minimumFrames ?? 10;
  const serviceFee = storefrontQuery.data?.homeTryOn.serviceFee ?? 500;

  const remainingCount = useMemo(() => Math.max(0, minimumFrames - selectedFrames.length), [minimumFrames, selectedFrames.length]);

  if (productsQuery.isLoading || !productsQuery.data) {
    return <section className="page loading-panel">Loading try-at-home frames...</section>;
  }

  return (
    <div className="page">
      <section className="page-section">
        <SectionHeader
          eyebrow="Window shopping mode"
          title="Send ten or more frames home before the final prescription order."
          description={`This flow is already connected to the API. Customers can request home try-on for Rs ${serviceFee}, and the admin dashboard sees the submissions.`}
        />

        <div className="try-on-banner">
          <div>
            <strong>{selectedFrames.length}</strong>
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

        <div className="product-grid">
          {productsQuery.data.products.map((product) => {
            const selected = selectedFrames.includes(product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                action={
                  <button
                    className={selected ? "mini-button is-selected" : "mini-button"}
                    onClick={() =>
                      setSelectedFrames((current) =>
                        current.includes(product.id)
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id],
                      )
                    }
                  >
                    {selected ? "Selected" : "Select"}
                  </button>
                }
              />
            );
          })}
        </div>
      </section>

      <section className="page-section">
        <div className="form-panel">
          <h3>Delivery details</h3>
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
            disabled={selectedFrames.length < minimumFrames || mutation.isPending}
            onClick={() => mutation.mutate({ ...form, selectedFrameIds: selectedFrames })}
          >
            {mutation.isPending ? "Submitting..." : "Request try-at-home"}
          </button>

          {mutation.isError ? <p className="inline-error">{mutation.error.message}</p> : null}
          {mutation.isSuccess ? (
            <div className="success-panel">
              <strong>Request created: {mutation.data.request.id}</strong>
              <p>The admin panel can now review the request and collect Rs {mutation.data.request.serviceFee} by COD.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
