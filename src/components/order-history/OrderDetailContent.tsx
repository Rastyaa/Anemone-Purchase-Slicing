import { OrderStatusTimeline } from "@/components/order-history/OrderStatusTimeline";
import { paymentMethodLabel } from "@/components/order-history/order-display";
import { formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

interface OrderDetailContentProps {
  order: Order;
}

export function OrderDetailContent({ order }: OrderDetailContentProps) {
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
      </div>
      <div>
        <p className="mb-2 text-xs font-medium uppercase text-neutral-400">Status Pesanan</p>
        <OrderStatusTimeline timeline={order.timeline} cancelled={order.status === "dibatalkan"} />
      </div>
    </div>
  );
}
