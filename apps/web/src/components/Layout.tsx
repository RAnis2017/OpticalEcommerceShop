import { NavLink, Outlet } from "react-router-dom";

import { useCart } from "../state/cart-context";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/try-at-home", label: "Try at Home" },
  { to: "/admin", label: "Admin" },
];

export function Layout() {
  const { itemCount } = useCart();

  return (
    <div className="shell">
      <header className="site-header">
        <NavLink className="brand-lockup" to="/">
          <span className="brand-mark">SV</span>
          <div>
            <p className="brand-name">Studio Vision</p>
            <p className="brand-tag">Single-brand optical commerce</p>
          </div>
        </NavLink>

        <nav className="site-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink className="cart-pill" to="/cart">
            Cart
            <span>{itemCount}</span>
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
