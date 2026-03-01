import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";

import { getAdminOrders, getAdminOverview, getAdminSession, getAdminTryOnRequests, logoutAdmin } from "../lib/api";

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
    <div className="page">
      <section className="page-section">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1>Operations dashboard</h1>
            <p>{sessionQuery.data.session.email}</p>
          </div>
          <div className="dashboard-actions">
            <Link className="button button-secondary" to="/shop">
              View storefront
            </Link>
            <button className="button button-primary" onClick={() => logoutMutation.mutate()}>
              Sign out
            </button>
          </div>
        </div>

        {overviewQuery.data ? (
          <div className="stat-grid">
            <div className="stat-card">
              <strong>{overviewQuery.data.overview.totalOrders}</strong>
              <span>Total orders</span>
            </div>
            <div className="stat-card">
              <strong>Rs {overviewQuery.data.overview.revenueBooked.toLocaleString()}</strong>
              <span>Revenue booked</span>
            </div>
            <div className="stat-card">
              <strong>Rs {overviewQuery.data.overview.codPending.toLocaleString()}</strong>
              <span>COD pending</span>
            </div>
            <div className="stat-card">
              <strong>{overviewQuery.data.overview.tryOnPending}</strong>
              <span>Open try-at-home requests</span>
            </div>
          </div>
        ) : null}

        <div className="dashboard-grid">
          <section className="admin-panel">
            <h2>Orders</h2>
            <div className="table-stack">
              {ordersQuery.data?.orders.map((order) => (
                <article key={order.id} className="table-card">
                  <div>
                    <strong>{order.id}</strong>
                    <span>{order.customerName}</span>
                  </div>
                  <div>
                    <strong>Rs {order.codAmount.toLocaleString()}</strong>
                    <span>{order.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <h2>Try-at-home requests</h2>
            <div className="table-stack">
              {tryOnQuery.data?.tryOnRequests.map((request) => (
                <article key={request.id} className="table-card">
                  <div>
                    <strong>{request.id}</strong>
                    <span>
                      {request.customerName} · {request.selectedFrames.length} frames
                    </span>
                  </div>
                  <div>
                    <strong>Rs {request.serviceFee}</strong>
                    <span>{request.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
