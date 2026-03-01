import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { PrescriptionMode } from "@optical/shared";
import { Navigate } from "react-router-dom";

import { createOrder } from "../lib/api";
import { useCart } from "../state/cart-context";

export function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState<{
    customerName: string;
    phone: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
    notes: string;
    prescriptionMode: PrescriptionMode;
    prescriptionSummary: string;
  }>({
    customerName: "",
    phone: "",
    city: "",
    addressLine1: "",
    addressLine2: "",
    notes: "",
    prescriptionMode: "upload_later" as const,
    prescriptionSummary: "",
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart();
    },
  });

  if (items.length === 0 && !mutation.isSuccess) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="page">
      <section className="page-section">
        <div className="checkout-layout">
          <div className="form-panel">
            <h2>Cash on delivery checkout</h2>
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
                Prescription mode
                <select
                  value={form.prescriptionMode}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      prescriptionMode: event.target.value as "manual" | "upload_later" | "none",
                    }))
                  }
                >
                  <option value="upload_later">Share later</option>
                  <option value="manual">Manual entry summary</option>
                  <option value="none">Frame only</option>
                </select>
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
                Prescription summary
                <textarea
                  rows={4}
                  placeholder="OD/OS/SPH/CYL/Axis/PD if available"
                  value={form.prescriptionSummary}
                  onChange={(event) => setForm((current) => ({ ...current, prescriptionSummary: event.target.value }))}
                />
              </label>
              <label className="full-span">
                Notes
                <textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
              </label>
            </div>

            <button
              className="button button-primary"
              disabled={mutation.isPending}
              onClick={() =>
                mutation.mutate({
                  ...form,
                  items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    lensPackageId: item.lensPackageId,
                    requiresPrescription: item.requiresPrescription,
                  })),
                })
              }
            >
              {mutation.isPending ? "Placing order..." : "Place COD order"}
            </button>

            {mutation.isError ? <p className="inline-error">{mutation.error.message}</p> : null}
            {mutation.isSuccess ? (
              <div className="success-panel">
                <strong>Order placed: {mutation.data.order.id}</strong>
                <p>COD payable on delivery: Rs {mutation.data.order.codAmount.toLocaleString()}</p>
              </div>
            ) : null}
          </div>

          <aside className="summary-card">
            <p>COD total</p>
            <strong>Rs {cartTotal.toLocaleString()}</strong>
            <span>Payment mode: cash on delivery</span>
          </aside>
        </div>
      </section>
    </div>
  );
}
