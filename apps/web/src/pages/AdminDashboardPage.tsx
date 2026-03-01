import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";

import { getAdminOrders, getAdminOverview, getAdminSession, getAdminTryOnRequests, logoutAdmin } from "../lib/api";

function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

export function AdminDashboardPage() {
  const sessionQuery = useQuery({
    queryKey: ["admin-session"],
    queryFn: getAdminSession,
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAdmin,
    onSuccess: () => {
      window.location.href = "/admin/login";
    },
  });

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: getAdminOverview,
    enabled: sessionQuery.data?.session.authenticated === true,
  });

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
    enabled: sessionQuery.data?.session.authenticated === true,
  });

  const tryOnQuery = useQuery({
    queryKey: ["admin-try-on"],
    queryFn: getAdminTryOnRequests,
    enabled: sessionQuery.data?.session.authenticated === true,
  });

  if (sessionQuery.isLoading) {
    return <section className="page loading-panel">Checking admin session...</section>;
  }

  if (!sessionQuery.data?.session.authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-dashboard-page">
      <section className="admin-dashboard">
        <div className="dashboard-header admin-dashboard-header">
          <div>
            <p className="eyebrow">Studio Vision Admin</p>
            <h1>Operations dashboard</h1>
            <p>{sessionQuery.data.session.email}</p>
          </div>
          <div className="dashboard-actions">
            <button className="button button-primary" onClick={() => logoutMutation.mutate()}>
              Sign out
            </button>
          </div>
        </div>

        {overviewQuery.data ? (
          <div className="admin-kpi-grid">
            <article className="admin-kpi-card accent-card">
              <span>Revenue booked</span>
              <strong>Rs {overviewQuery.data.overview.revenueBooked.toLocaleString()}</strong>
            </article>
            <article className="admin-kpi-card">
              <span>Active orders</span>
              <strong>{overviewQuery.data.overview.totalOrders}</strong>
            </article>
            <article className="admin-kpi-card">
              <span>COD pending</span>
              <strong>Rs {overviewQuery.data.overview.codPending.toLocaleString()}</strong>
            </article>
            <article className="admin-kpi-card">
              <span>Try-at-home queue</span>
              <strong>{overviewQuery.data.overview.tryOnPending}</strong>
            </article>
          </div>
        ) : null}

        <div className="admin-content-grid">
          <section className="admin-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Orders</p>
                <h2>Current order pipeline</h2>
              </div>
            </div>
            <div className="table-stack">
              {ordersQuery.data?.orders.map((order) => (
                <article key={order.id} className="table-card order-card">
                  <div>
                    <strong>{order.customerName}</strong>
                    <span>{order.id}</span>
                    <span>{order.city}</span>
                  </div>
                  <div>
                    <strong>Rs {order.codAmount.toLocaleString()}</strong>
                    <span>{formatDate(order.createdAt)}</span>
                    <span className={`status-pill status-${order.status}`}>{order.status.replaceAll("_", " ")}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Home try-on</p>
                <h2>Shortlist and dispatch queue</h2>
              </div>
            </div>
            <div className="table-stack">
              {tryOnQuery.data?.tryOnRequests.map((request) => (
                <article key={request.id} className="table-card order-card">
                  <div>
                    <strong>{request.customerName}</strong>
                    <span>{request.id}</span>
                    <span>{request.selectedFrames.length} frames selected</span>
                  </div>
                  <div>
                    <strong>Rs {request.serviceFee}</strong>
                    <span>{formatDate(request.createdAt)}</span>
                    <span className={`status-pill status-${request.status}`}>{request.status.replaceAll("_", " ")}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="admin-panel admin-side-note">
            <p className="eyebrow">Daily focus</p>
            <h2>Operational priorities</h2>
            <ul className="feature-list">
              <li>Confirm home try-on dispatches before the selected slots.</li>
              <li>Call COD customers for prescription confirmation where needed.</li>
              <li>Track returned trial frames before converting final orders.</li>
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}
