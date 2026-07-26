"use client";

import { useState } from "react";
import { CartItem } from "@/components/cart/CartItem";
import { CostBreakdown } from "@/components/cart/CostBreakdown";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyCartIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-context";
import { expedisiOptions, getExpedisiLabel } from "@/lib/expedisi";
import { formatRupiah } from "@/lib/format";
import { paymentOptions } from "@/lib/payment";
import { calcSubtotal, calcTax, calcTotal } from "@/lib/pricing";
import { useIsDesktop } from "@/lib/use-media-query";
import type { PaymentMethod, Product } from "@/lib/types";

const FIELD_TRIGGER_CLASSNAME =
  "flex w-full items-center justify-between gap-2 rounded-md border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-900 hover:border-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1";

const expedisiDropdownOptions: DropdownOption<string>[] = expedisiOptions.map((option) => ({
  value: option.value,
  label: option.label,
  description: `Ongkir ${formatRupiah(option.ongkir)}`,
}));

const paymentDropdownOptions: DropdownOption<PaymentMethod>[] = paymentOptions.map((option) => ({
  value: option.value,
  label: option.label,
}));

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
  const isDesktop = useIsDesktop();
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
                editable={!isDesktop}
                onIncrement={() => increment(product.id, product.stockHO)}
                onDecrement={() => decrement(product.id)}
                onQtyChange={(next) => setQty(product.id, next, product.stockHO)}
                onRemove={() => setPendingRemove(product)}
              />
            );
          })}
        </div>

        <hr className="border-neutral-200" />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-neutral-500">Ekspedisi</p>
            <Dropdown
              options={expedisiDropdownOptions}
              value={expedisiValue}
              onChange={onExpedisiChange}
              ariaLabel="Pilih ekspedisi"
              triggerClassName={FIELD_TRIGGER_CLASSNAME}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-neutral-500">Metode Pembayaran</p>
            <Dropdown
              options={paymentDropdownOptions}
              value={paymentMethod}
              onChange={setPaymentMethod}
              ariaLabel="Pilih metode pembayaran"
              triggerClassName={FIELD_TRIGGER_CLASSNAME}
            />
          </div>
        </div>
        <hr className="border-neutral-200" />
        <CostBreakdown subtotal={subtotal} tax={tax} expedisiLabel={getExpedisiLabel(expedisiValue)} ongkir={ongkir} />
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
