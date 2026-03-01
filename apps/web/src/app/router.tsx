import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "../components/AdminLayout";
import { Layout } from "../components/Layout";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { AdminLoginPage } from "../pages/AdminLoginPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";
import { ShopPage } from "../pages/ShopPage";
import { TryAtHomePage } from "../pages/TryAtHomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "shop", element: <ShopPage /> },
      { path: "products/:slug", element: <ProductPage /> },
      { path: "try-at-home", element: <TryAtHomePage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: "login", element: <AdminLoginPage /> },
    ],
  },
]);
