import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { App } from "./app/App";
import { queryClient } from "./app/query-client";
import { CartProvider } from "./state/cart-context";
import { TryOnProvider } from "./state/try-on-context";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TryOnProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </TryOnProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
);
