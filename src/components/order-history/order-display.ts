import type { BadgeTone } from "@/components/ui/Badge";
import type { OrderStatus } from "@/lib/types";

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

export function formatOrderDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
