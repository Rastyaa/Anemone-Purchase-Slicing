"use client";

import Image from "next/image";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoopGauge } from "@/components/ui/LoopGauge";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { deriveStockStatus } from "@/lib/validation";
import type { Product, StockStatus } from "@/lib/types";

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

interface ProductCardProps {
  product: Product;
  onViewDetail: (product: Product) => void;
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { getQty, increment, decrement, remove } = useCart();
  const qty = getQty(product.id);
  const status = deriveStockStatus(product.stockHO);
  const isOutOfStock = status === "habis";
  const isAdded = qty > 0;

  return (
    <article
      className={`flex gap-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${
        isAdded ? "border-success-200 bg-success-50/30" : "border-neutral-200 bg-white hover:border-success-300"
      }`}
    >
      <Image
        src={product.image}
        alt={product.name}
        width={140}
        height={140}
        className="h-[140px] w-[140px] rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col gap-2">
        <Badge tone={isAdded ? "success" : statusTone[status]}>
          {isAdded ? "Ditambahkan ✓" : statusLabel[status]}
        </Badge>
        <h3 className="font-semibold text-neutral-900">{product.name}</h3>
        <p className="text-sm text-neutral-500">{formatRupiah(product.price)} / pcs</p>
        <div className="flex items-center gap-1.5">
          <LoopGauge fraction={statusGaugeFraction[status]} size={16} strokeWidth={2.5} className={statusGaugeColor[status]} />
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
            <Button variant="secondary" disabled>
              Stok Habis
            </Button>
          ) : isAdded ? (
            <QuantityStepper
              qty={qty}
              stockHO={product.stockHO}
              onIncrement={() => increment(product.id, product.stockHO)}
              onDecrement={() => decrement(product.id)}
              onRemove={() => remove(product.id)}
            />
          ) : (
            <Button onClick={() => increment(product.id, product.stockHO)}>+ Tambah</Button>
          )}
        </div>
      </div>
    </article>
  );
}
