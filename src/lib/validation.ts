import type { StockStatus } from "@/lib/types";

const LIMITED_STOCK_THRESHOLD = 20;

export function deriveStockStatus(stockHO: number): StockStatus {
  if (stockHO === 0) return "habis";
  if (stockHO < LIMITED_STOCK_THRESHOLD) return "terbatas";
  return "tersedia";
}

export function clampQty(qty: number, stockHO: number): number {
  return Math.min(Math.max(qty, 0), stockHO);
}

export function isAtMinQty(qty: number): boolean {
  return qty <= 0;
}

export function isAtMaxStock(qty: number, stockHO: number): boolean {
  return qty >= stockHO;
}
