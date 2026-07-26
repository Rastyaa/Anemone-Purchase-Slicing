"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { LoopGauge } from "@/components/ui/LoopGauge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { deriveStockStatus } from "@/lib/validation";
import type { Product, ProductCategory, StockStatus } from "@/lib/types";

const statusLabel: Record<StockStatus, string> = {
  tersedia: "Stok Tersedia",
  terbatas: "Stok Terbatas",
  habis: "Stok Habis",
};

const statusTone: Record<StockStatus, BadgeTone> = {
  tersedia: "success",
  terbatas: "warning",
  habis: "danger",
};

const statusGaugeFraction: Record<StockStatus, number> = {
  tersedia: 1,
  terbatas: 0.45,
  habis: 0.08,
};

const statusGaugeColor: Record<StockStatus, string> = {
  tersedia: "text-success-600",
  terbatas: "text-warning-500",
  habis: "text-neutral-300",
};

const statusGaugeTitle: Record<StockStatus, string> = {
  tersedia: "Stok banyak",
  terbatas: "Stok menipis",
  habis: "Stok kosong",
};

const categoryTint: Record<ProductCategory, string> = {
  Modul: "bg-gradient-to-tr from-brand-700/30 to-transparent",
  Perlengkapan: "bg-gradient-to-tr from-warning-600/30 to-transparent",
  Dekorasi: "bg-gradient-to-tr from-magenta-700/30 to-transparent",
  Buku: "bg-gradient-to-tr from-info-700/30 to-transparent",
};

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { getQty, increment, decrement, setQty, remove } = useCart();
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const qty = getQty(product.id);
  const status = deriveStockStatus(product.stockHO);
  const isOutOfStock = status === "habis";
  const isAdded = qty > 0;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md ${
        isAdded ? "border-success-200 bg-success-50/30" : "border-neutral-200 bg-white hover:border-success-300"
      }`}
    >
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={180}
          className="h-28 w-full object-cover"
        />
        <div aria-hidden="true" className={`absolute inset-0 ${categoryTint[product.category]}`} />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Badge tone={isAdded ? "success" : statusTone[status]}>
          {isAdded ? "Ditambahkan ✓" : statusLabel[status]}
        </Badge>
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-sm text-neutral-500">{formatRupiah(product.price)} / pcs</p>
        <div className="flex items-center gap-2" title={statusGaugeTitle[status]}>
          <LoopGauge fraction={statusGaugeFraction[status]} size={20} strokeWidth={3.5} className={statusGaugeColor[status]} />
          <span className="text-xs text-neutral-400">
            {status === "habis" ? "Stok habis di HO" : `${product.stockHO} pcs di HO`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onViewDetail(product)}
          className="text-left text-sm text-brand-700 underline-offset-2 hover:underline"
        >
          Lihat Detail Produk
        </button>
        <div className="mt-auto pt-2">
          {isOutOfStock ? (
            <Button variant="secondary" disabled className="w-full">
              Stok Habis
            </Button>
          ) : isAdded ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <QuantityStepper
                qty={qty}
                stockHO={product.stockHO}
                onIncrement={() => increment(product.id, product.stockHO)}
                onDecrement={() => decrement(product.id)}
                onQtyChange={(next) => setQty(product.id, next, product.stockHO)}
                onRemove={() => setConfirmingRemove(true)}
              />
              <span className="text-sm font-semibold text-brand-700">{formatRupiah(product.price * qty)}</span>
            </div>
          ) : (
            <Button className="w-full" onClick={() => increment(product.id, product.stockHO)}>
              + Tambah
            </Button>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirmingRemove}
        title="Hapus dari keranjang?"
        description={`${product.name} akan dihapus dari keranjang.`}
        confirmLabel="Hapus"
        danger
        onConfirm={() => {
          remove(product.id);
          setConfirmingRemove(false);
        }}
        onClose={() => setConfirmingRemove(false)}
      />
    </article>
  );
}
