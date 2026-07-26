"use client";

import { useState } from "react";
import { OrderDetailContent } from "@/components/order-history/OrderDetailContent";
import { formatOrderDate, orderStatusLabel, orderStatusTone } from "@/components/order-history/order-display";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/format";
import { calcOrderSubtotal, calcTax, calcTotal } from "@/lib/pricing";
import type { Order } from "@/lib/types";

interface OrderHistoryCardListProps {
  orders: Order[];
}

export function OrderHistoryCardList({ orders }: OrderHistoryCardListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => {
        const subtotal = calcOrderSubtotal(order);
        const tax = calcTax(subtotal);
        const total = calcTotal(subtotal, tax, order.ongkir);
        const isExpanded = expandedId === order.id;

        return (
          <div key={order.id} className="rounded-lg border border-neutral-200 p-4">
            <div className="flex justify-between text-sm font-medium text-neutral-900">
              <span>{order.id}</span>
              <span>{formatRupiah(total)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-neutral-500">{formatOrderDate(order.date)}</span>
              <Badge tone={orderStatusTone[order.status]}>{orderStatusLabel[order.status]}</Badge>
            </div>
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              aria-expanded={isExpanded}
              aria-controls={`order-detail-mobile-${order.id}`}
              className="mt-3 text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
            >
              {isExpanded ? "Tutup Detail" : "Lihat Detail"}
            </button>

            {isExpanded && (
              <div id={`order-detail-mobile-${order.id}`} className="mt-4 border-t border-neutral-100 pt-4">
                <OrderDetailContent order={order} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
