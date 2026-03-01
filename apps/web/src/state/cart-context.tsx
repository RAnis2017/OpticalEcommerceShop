import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  quantity: number;
  basePrice: number;
  lensPackageId?: string;
  lensPackageName?: string;
  lensPrice?: number;
  requiresPrescription: boolean;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, lensPackageId?: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "studio-vision-cart";

const CartContext = createContext<CartContextValue | null>(null);

function getItemKey(productId: string, lensPackageId?: string): string {
  return `${productId}:${lensPackageId ?? "frame-only"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      setItems(JSON.parse(saved) as CartItem[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce(
      (total, item) => total + (item.basePrice + (item.lensPrice ?? 0)) * item.quantity,
      0,
    );

    return {
      items,
      itemCount,
      cartTotal,
      addItem(item) {
        setItems((current) => {
          const key = getItemKey(item.productId, item.lensPackageId);
          const existing = current.find(
            (entry) => getItemKey(entry.productId, entry.lensPackageId) === key,
          );

          if (!existing) {
            return [...current, item];
          }

          return current.map((entry) =>
            getItemKey(entry.productId, entry.lensPackageId) === key
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry,
          );
        });
      },
      removeItem(productId, lensPackageId) {
        setItems((current) =>
          current.filter(
            (item) => getItemKey(item.productId, item.lensPackageId) !== getItemKey(productId, lensPackageId),
          ),
        );
      },
      clearCart() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return value;
}
