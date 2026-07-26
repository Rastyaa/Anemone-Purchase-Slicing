import type { CartLine } from "@/lib/types";
import { clampQty } from "@/lib/validation";

export type CartAction =
  | { type: "increment"; productId: string; stockHO: number }
  | { type: "decrement"; productId: string }
  | { type: "setQty"; productId: string; qty: number; stockHO: number }
  | { type: "addMany"; lines: { productId: string; qty: number; stockHO: number }[] }
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "remove"; productId: string }
  | { type: "clear" };

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
    case "setQty": {
      const nextQty = clampQty(action.qty, action.stockHO);
      const existing = state.find((line) => line.productId === action.productId);
      if (nextQty === 0) return state.filter((line) => line.productId !== action.productId);
      if (!existing) return [...state, { productId: action.productId, qty: nextQty }];
      return state.map((line) => (line.productId === action.productId ? { ...line, qty: nextQty } : line));
    }
    case "addMany": {
      let next = state;
      for (const incoming of action.lines) {
        const existing = next.find((line) => line.productId === incoming.productId);
        const nextQty = clampQty((existing?.qty ?? 0) + incoming.qty, incoming.stockHO);
        if (nextQty === 0) continue;
        next = existing
          ? next.map((line) => (line.productId === incoming.productId ? { ...line, qty: nextQty } : line))
          : [...next, { productId: incoming.productId, qty: nextQty }];
      }
      return next;
    }
    case "hydrate":
      return action.lines;
    case "remove":
      return state.filter((line) => line.productId !== action.productId);
    case "clear":
      return [];
    default:
      return state;
  }
}
