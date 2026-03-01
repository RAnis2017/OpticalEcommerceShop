import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { loginAdmin } from "../lib/api";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginAdmin(email, password),
    onSuccess: () => {
      navigate("/admin");
    },
  });

  return (
    <div className="admin-auth-page">
      <section className="auth-section">
        <div className="auth-card admin-auth-card">
          <p className="eyebrow">Authorised staff</p>
          <h1>Studio Vision operations</h1>
          <p>Secure access for order handling, customer records, try-at-home requests, and COD operations.</p>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@studiovision.com" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" />
          </label>
          <button className="button button-primary" disabled={mutation.isPending} onClick={() => mutation.mutate({ email, password })}>
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </button>
          {mutation.isError ? <p className="inline-error">{mutation.error.message}</p> : null}
          <Link className="text-link" to="/">
            Back to storefront
          </Link>
        </div>
      </section>
    </div>
  );
}
