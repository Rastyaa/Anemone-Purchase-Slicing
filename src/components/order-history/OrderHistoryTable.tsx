"use client";

import { Fragment, useState } from "react";
import { OrderDetailContent } from "@/components/order-history/OrderDetailContent";
import { formatOrderDate, orderStatusLabel, orderStatusTone } from "@/components/order-history/order-display";
import { Badge } from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/format";
import { calcOrderSubtotal, calcTax, calcTotal } from "@/lib/pricing";
import type { Order } from "@/lib/types";

interface OrderHistoryTableProps {
  orders: Order[];
}

export function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-neutral-200 text-xs font-medium uppercase text-neutral-400">
          <th className="py-2 pr-4">No. Pesanan</th>
          <th className="py-2 pr-4">Tanggal</th>
          <th className="py-2 pr-4">Item</th>
          <th className="py-2 pr-4">Total</th>
          <th className="py-2 pr-4">Status</th>
          <th className="py-2">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const subtotal = calcOrderSubtotal(order);
          const tax = calcTax(subtotal);
          const total = calcTotal(subtotal, tax, order.ongkir);
          const isExpanded = expandedId === order.id;

          return (
            <Fragment key={order.id}>
              <tr className="border-b border-neutral-100">
                <td className="py-3 pr-4 font-medium text-neutral-900">{order.id}</td>
                <td className="py-3 pr-4 text-neutral-500">{formatOrderDate(order.date)}</td>
                <td className="py-3 pr-4 text-neutral-700">{order.lines.map((line) => line.name).join(", ")}</td>
                <td className="py-3 pr-4 font-medium text-neutral-900">{formatRupiah(total)}</td>
                <td className="py-3 pr-4">
                  <Badge tone={orderStatusTone[order.status]}>{orderStatusLabel[order.status]}</Badge>
                </td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`order-detail-${order.id}`}
                    className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline"
                  >
                    {isExpanded ? "Tutup Detail" : "Lihat Detail"}
                  </button>
                </td>
              </tr>
              {isExpanded && (
                <tr id={`order-detail-${order.id}`} className="border-b border-neutral-100 bg-neutral-50">
                  <td colSpan={6} className="p-6">
                    <OrderDetailContent order={order} />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
