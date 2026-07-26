import type { Order, Product } from "@/lib/types";
import { clampQty } from "@/lib/validation";

export interface ReorderLine {
  productId: string;
  qty: number;
  stockHO: number;
}

export interface ReorderResult {
  lines: ReorderLine[];
  skipped: string[];
}

export function buildReorderLines(order: Order, products: Product[]): ReorderResult {
  const lines: ReorderLine[] = [];
  const skipped: string[] = [];

  for (const line of order.lines) {
    const product = products.find((item) => item.id === line.productId);
    if (!product || product.stockHO === 0) {
      skipped.push(line.name);
      continue;
    }
    lines.push({ productId: product.id, qty: clampQty(line.qty, product.stockHO), stockHO: product.stockHO });
  }

  return { lines, skipped };
}
