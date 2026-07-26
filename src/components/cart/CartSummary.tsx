"use client";

import { useState } from "react";
import { CartItem } from "@/components/cart/CartItem";
import { CostBreakdown } from "@/components/cart/CostBreakdown";
import { PaymentOption } from "@/components/cart/PaymentOption";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyCartIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { paymentOptions } from "@/lib/payment";
import { calcSubtotal, calcTax, calcTotal } from "@/lib/pricing";
import type { PaymentMethod, Product } from "@/lib/types";

interface CartSummaryProps {
  products: Product[];
  isSubmitting: boolean;
  onSubmit: (paymentMethod: PaymentMethod) => void;
  expedisiValue: string;
  onExpedisiChange: (value: string) => void;
  ongkir: number;
}

export function CartSummary({
  products,
  isSubmitting,
  onSubmit,
  expedisiValue,
  onExpedisiChange,
  ongkir,
}: CartSummaryProps) {
  const { lines, increment, decrement, setQty, remove } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("transfer-bank");
  const [pendingRemove, setPendingRemove] = useState<Product | null>(null);

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<EmptyCartIcon />}
        title="Keranjang masih kosong"
        description="Tambahkan produk dari katalog untuk mulai membuat pesanan."
      />
    );
  }

  const subtotal = calcSubtotal(lines, products);
  const tax = calcTax(subtotal);
  const total = calcTotal(subtotal, tax, ongkir);

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-500">Item Terpilih:</p>
          {lines.map((line) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <CartItem
                key={line.productId}
                product={product}
                qty={line.qty}
                onIncrement={() => increment(product.id, product.stockHO)}
                onDecrement={() => decrement(product.id)}
                onQtyChange={(next) => setQty(product.id, next, product.stockHO)}
                onRemove={() => setPendingRemove(product)}
              />
            );
          })}
        </div>

        <hr className="border-neutral-200" />
        <CostBreakdown
          subtotal={subtotal}
          tax={tax}
          expedisiValue={expedisiValue}
          onExpedisiChange={onExpedisiChange}
          ongkir={ongkir}
        />
        <hr className="border-neutral-200" />

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-neutral-500">Metode Pembayaran</p>
          {paymentOptions.map((option) => (
            <PaymentOption
              key={option.value}
              label={option.label}
              selected={paymentMethod === option.value}
              onSelect={() => setPaymentMethod(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-4 border-t border-neutral-200 pt-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-neutral-900">TOTAL TAGIHAN</p>
          <p className="font-bold text-brand-700">{formatRupiah(total)}</p>
        </div>
        <Button className="w-full" loading={isSubmitting} onClick={() => onSubmit(paymentMethod)}>
          {isSubmitting ? "Memproses..." : "Submit Order / Bayar"}
        </Button>
      </div>

      {pendingRemove && (
        <ConfirmDialog
          open
          title="Hapus dari keranjang?"
          description={`${pendingRemove.name} akan dihapus dari keranjang.`}
          confirmLabel="Hapus"
          danger
          onConfirm={() => {
            remove(pendingRemove.id);
            setPendingRemove(null);
          }}
          onClose={() => setPendingRemove(null)}
        />
      )}
    </div>
  );
}
