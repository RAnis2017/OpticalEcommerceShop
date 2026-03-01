import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import { loginAdmin } from "../lib/api";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@opticaldemo.local");
  const [password, setPassword] = useState("change-this-before-production");

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => loginAdmin(email, password),
    onSuccess: () => {
      navigate("/admin");
    },
  });

  return (
    <div className="page">
      <section className="page-section auth-section">
        <div className="auth-card">
          <p className="eyebrow">Admin access</p>
          <h1>Sign in to Studio Vision operations.</h1>
          <p>
            This first cut uses server-issued cookies for admin routes. Replace the seed credentials in your local `.env`
            before any real deployment.
          </p>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
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
