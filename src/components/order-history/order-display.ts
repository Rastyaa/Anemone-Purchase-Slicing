import type { BadgeTone } from "@/components/ui/Badge";
import type { Order, OrderStatus } from "@/lib/types";

export const orderStatusLabel: Record<OrderStatus, string> = {
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export const orderStatusTone: Record<OrderStatus, BadgeTone> = {
  diproses: "warning",
  dikirim: "info",
  selesai: "success",
  dibatalkan: "danger",
};

export const paymentMethodLabel: Record<Order["paymentMethod"], string> = {
  "transfer-bank": "Transfer Bank",
  cod: "COD",
  qris: "QRIS",
};

export function formatOrderDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
