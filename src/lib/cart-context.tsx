"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import type { ReactNode } from "react";
import type { CartLine } from "@/lib/types";
import { cartReducer } from "@/lib/cart-reducer";

const STORAGE_KEY = "anemone-cart";

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const line = value as Record<string, unknown>;
  return typeof line.productId === "string" && typeof line.qty === "number" && Number.isInteger(line.qty) && line.qty > 0;
}

function readStoredLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine).map((line) => ({ productId: line.productId, qty: line.qty }));
  } catch {
    return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  getQty: (productId: string) => number;
  increment: (productId: string, stockHO: number) => void;
  decrement: (productId: string) => void;
  setQty: (productId: string, qty: number, stockHO: number) => void;
  addMany: (lines: { productId: string; qty: number; stockHO: number }[]) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);
  const skippedFirstPersistRef = useRef(false);

  useEffect(() => {
    const stored = readStoredLines();
    if (stored.length > 0) dispatch({ type: "hydrate", lines: stored });
  }, []);

  useEffect(() => {
    if (!skippedFirstPersistRef.current) {
      skippedFirstPersistRef.current = true;
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      getQty: (productId) => lines.find((line) => line.productId === productId)?.qty ?? 0,
      increment: (productId, stockHO) => dispatch({ type: "increment", productId, stockHO }),
      decrement: (productId) => dispatch({ type: "decrement", productId }),
      setQty: (productId, qty, stockHO) => dispatch({ type: "setQty", productId, qty, stockHO }),
      addMany: (incoming) => dispatch({ type: "addMany", lines: incoming }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
