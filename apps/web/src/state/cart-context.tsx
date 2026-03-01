import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  image: string;
  quantity: number;
  stockAvailable: number;
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
  updateItemQuantity: (params: {
    productId: string;
    quantity: number;
    lensPackageId?: string;
    stockAvailable?: number;
  }) => void;
  getItemQuantity: (productId: string, lensPackageId?: string) => number;
  getProductQuantity: (productId: string) => number;
  removeItem: (productId: string, lensPackageId?: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "studio-vision-cart";

const CartContext = createContext<CartContextValue | null>(null);

function getItemKey(productId: string, lensPackageId?: string): string {
  return `${productId}:${lensPackageId ?? "frame-only"}`;
}

function clampQuantity(quantity: number, maxQuantity: number) {
  return Math.max(0, Math.min(quantity, maxQuantity));
}

function getVariantQuantity(items: CartItem[], productId: string, lensPackageId?: string) {
  return items.find((item) => getItemKey(item.productId, item.lensPackageId) === getItemKey(productId, lensPackageId))
    ?.quantity ?? 0;
}

function getProductQuantityTotal(items: CartItem[], productId: string) {
  return items
    .filter((item) => item.productId === productId)
    .reduce((total, item) => total + item.quantity, 0);
}

function sanitizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const item = entry as Partial<CartItem>;
    const quantity = Number.isFinite(item.quantity) ? Math.max(1, Math.trunc(item.quantity as number)) : 1;
    const stockAvailable =
      Number.isFinite(item.stockAvailable) && (item.stockAvailable as number) > 0
        ? Math.trunc(item.stockAvailable as number)
        : quantity;

    if (
      typeof item.productId !== "string" ||
      typeof item.productSlug !== "string" ||
      typeof item.productName !== "string" ||
      typeof item.image !== "string" ||
      typeof item.basePrice !== "number" ||
      typeof item.requiresPrescription !== "boolean"
    ) {
      return [];
    }

    return [
      {
        productId: item.productId,
        productSlug: item.productSlug,
        productName: item.productName,
        image: item.image,
        quantity: clampQuantity(quantity, stockAvailable) || 1,
        stockAvailable,
        basePrice: item.basePrice,
        lensPackageId: item.lensPackageId,
        lensPackageName: item.lensPackageName,
        lensPrice: item.lensPrice,
        requiresPrescription: item.requiresPrescription,
      },
    ];
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      setItems(sanitizeItems(JSON.parse(saved)));
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
          const otherVariantQuantity =
            getProductQuantityTotal(current, item.productId) - (existing?.quantity ?? 0);
          const maxForVariant = Math.max(item.stockAvailable - otherVariantQuantity, 0);
          const nextQuantity = clampQuantity((existing?.quantity ?? 0) + item.quantity, maxForVariant);

          if (nextQuantity <= 0) {
            return current;
          }

          if (!existing) {
            return [...current, { ...item, quantity: nextQuantity }];
          }

          return current.map((entry) =>
            getItemKey(entry.productId, entry.lensPackageId) === key
              ? {
                  ...entry,
                  ...item,
                  quantity: nextQuantity,
                }
              : entry,
          );
        });
      },
      updateItemQuantity({ productId, quantity, lensPackageId, stockAvailable }) {
        setItems((current) => {
          const key = getItemKey(productId, lensPackageId);
          const existing = current.find((entry) => getItemKey(entry.productId, entry.lensPackageId) === key);

          if (!existing) {
            return current;
          }

          const effectiveStock = stockAvailable ?? existing.stockAvailable;
          const otherVariantQuantity = getProductQuantityTotal(current, productId) - existing.quantity;
          const maxForVariant = Math.max(effectiveStock - otherVariantQuantity, 0);
          const nextQuantity = clampQuantity(quantity, maxForVariant);

          if (nextQuantity <= 0) {
            return current.filter((item) => getItemKey(item.productId, item.lensPackageId) !== key);
          }

          return current.map((item) =>
            getItemKey(item.productId, item.lensPackageId) === key
              ? {
                  ...item,
                  quantity: nextQuantity,
                  stockAvailable: effectiveStock,
                }
              : item,
          );
        });
      },
      getItemQuantity(productId, lensPackageId) {
        return getVariantQuantity(items, productId, lensPackageId);
      },
      getProductQuantity(productId) {
        return getProductQuantityTotal(items, productId);
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
