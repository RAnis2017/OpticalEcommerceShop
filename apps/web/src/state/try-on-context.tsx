import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface TryOnContextValue {
  selectedIds: string[];
  selectedCount: number;
  isSelected: (productId: string) => boolean;
  toggleSelection: (productId: string) => void;
  clearSelection: () => void;
}

const STORAGE_KEY = "studio-vision-try-on";

const TryOnContext = createContext<TryOnContextValue | null>(null);

export function TryOnProvider({ children }: { children: ReactNode }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return;
    }

    try {
      setSelectedIds(JSON.parse(saved) as string[]);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const value = useMemo<TryOnContextValue>(
    () => ({
      selectedIds,
      selectedCount: selectedIds.length,
      isSelected(productId) {
        return selectedIds.includes(productId);
      },
      toggleSelection(productId) {
        setSelectedIds((current) =>
          current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        );
      },
      clearSelection() {
        setSelectedIds([]);
      },
    }),
    [selectedIds],
  );

  return <TryOnContext.Provider value={value}>{children}</TryOnContext.Provider>;
}

export function useTryOn() {
  const value = useContext(TryOnContext);

  if (!value) {
    throw new Error("useTryOn must be used inside TryOnProvider");
  }

  return value;
}
