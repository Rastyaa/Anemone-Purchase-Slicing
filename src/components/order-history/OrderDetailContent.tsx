"use client";

import Link from "next/link";
import { useState } from "react";
import { OrderStatusTimeline } from "@/components/order-history/OrderStatusTimeline";
import { paymentMethodLabel } from "@/components/order-history/order-display";
import { Button } from "@/components/ui/Button";
import productsData from "@/data/products.json";
import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { buildReorderLines } from "@/lib/reorder";
import type { Order, Product } from "@/lib/types";

const products = productsData as Product[];

interface OrderDetailContentProps {
  order: Order;
}

interface ReorderFeedback {
  addedCount: number;
  skipped: string[];
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  const { addMany } = useCart();
  const [feedback, setFeedback] = useState<ReorderFeedback | null>(null);

  function handleReorder() {
    const { lines, skipped } = buildReorderLines(order, products);
    addMany(lines);
    setFeedback({ addedCount: lines.length, skipped });
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-neutral-400">Item Dipesan</p>
        <ul className="flex flex-col gap-1">
          {order.lines.map((line) => (
            <li key={line.name} className="flex justify-between text-sm text-neutral-700">
              <span>
                {line.name} ×{line.qty}
              </span>
              <span>{formatRupiah(line.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            {paymentMethodLabel[order.paymentMethod]}
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">{order.expedisi}</span>
        </div>
        <div className="mt-4">
          {feedback === null ? (
            <Button variant="secondary" onClick={handleReorder}>
              Pesan Lagi
            </Button>
          ) : (
            <div className="flex flex-col gap-1 text-sm" role="status">
              <p className="text-success-600">
                {feedback.addedCount} item ditambahkan ke keranjang
                {feedback.skipped.length > 0 && (
                  <span className="text-neutral-500"> · dilewati (stok habis): {feedback.skipped.join(", ")}</span>
                )}
              </p>
              <Link href="/" className="font-medium text-brand-700 underline-offset-2 hover:underline">
                Lihat Keranjang →
              </Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-neutral-400">Status Pesanan</p>
        <OrderStatusTimeline timeline={order.timeline} cancelled={order.status === "dibatalkan"} />
      </div>
    </div>
  );
}
