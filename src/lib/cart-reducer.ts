import type { CartLine } from "@/lib/types";
import { clampQty } from "@/lib/validation";

export type CartAction =
  | { type: "increment"; productId: string; stockHO: number }
  | { type: "decrement"; productId: string }
  | { type: "remove"; productId: string };

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "increment": {
      const existing = state.find((line) => line.productId === action.productId);
      const nextQty = clampQty((existing?.qty ?? 0) + 1, action.stockHO);
      if (!existing) {
        return [...state, { productId: action.productId, qty: nextQty }];
      }
      return state.map((line) => (line.productId === action.productId ? { ...line, qty: nextQty } : line));
    }
    case "decrement": {
      const existing = state.find((line) => line.productId === action.productId);
      if (!existing) return state;
      const nextQty = Math.max(existing.qty - 1, 0);
      if (nextQty === 0) return state.filter((line) => line.productId !== action.productId);
      return state.map((line) => (line.productId === action.productId ? { ...line, qty: nextQty } : line));
    }
    case "remove":
      return state.filter((line) => line.productId !== action.productId);
    default:
      return state;
  }
}
