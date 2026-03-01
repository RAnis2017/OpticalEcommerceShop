import { NavLink, Outlet } from "react-router-dom";

import { useCart } from "../state/cart-context";
import { useTryOn } from "../state/try-on-context";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/try-at-home", label: "Try at Home" },
];

export function Layout() {
  const { itemCount } = useCart();
  const { selectedCount } = useTryOn();

  return (
    <div className="shell">
      <header className="site-header">
        <NavLink className="brand-lockup" to="/">
          <span className="brand-mark">SV</span>
          <div>
            <p className="brand-name">Studio Vision</p>
            <p className="brand-tag">Eyewear, lenses, and home styling</p>
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
              {item.to === "/try-at-home" && selectedCount > 0 ? (
                <span className="nav-counter">{selectedCount}</span>
              ) : null}
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

      <footer className="site-footer">
        <div>
          <strong>Studio Vision</strong>
          <p>Prescription-ready frames, COD checkout, and in-home try-on for selected styles.</p>
        </div>
        <div className="footer-meta">
          <span>Crafted for a single optical house</span>
          <span>Home try-on from Rs 500</span>
        </div>
      </footer>
    </div>
  );
}
