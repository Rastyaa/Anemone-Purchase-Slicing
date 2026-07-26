import type { Product, StockStatus } from "@/lib/types";
import { deriveStockStatus } from "@/lib/validation";

export type CatalogFilter = StockStatus | "semua";

export const catalogFilterOptions: { value: CatalogFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "tersedia", label: "Tersedia" },
  { value: "terbatas", label: "Terbatas" },
  { value: "habis", label: "Habis" },
];

export function filterProducts(products: Product[], query: string, filter: CatalogFilter): Product[] {
  const normalized = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesFilter = filter === "semua" || deriveStockStatus(product.stockHO) === filter;
    const matchesQuery = product.name.toLowerCase().includes(normalized);
    return matchesFilter && matchesQuery;
  });
}
