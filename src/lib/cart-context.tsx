"use client";

import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import type { CartLine } from "@/lib/types";
import { cartReducer } from "@/lib/cart-reducer";

interface CartContextValue {
  lines: CartLine[];
  getQty: (productId: string) => number;
  increment: (productId: string, stockHO: number) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      getQty: (productId) => lines.find((line) => line.productId === productId)?.qty ?? 0,
      increment: (productId, stockHO) => dispatch({ type: "increment", productId, stockHO }),
      decrement: (productId) => dispatch({ type: "decrement", productId }),
      remove: (productId) => dispatch({ type: "remove", productId }),
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
