"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Modal } from "@/components/ui/Modal";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/lib/cart-context";
import { formatRupiah } from "@/lib/format";
import { useIsDesktop } from "@/lib/use-media-query";
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

interface ProductDetailPanelProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailPanel({ product, onClose }: ProductDetailPanelProps) {
  const isDesktop = useIsDesktop();
  const { getQty, increment, decrement } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const status = deriveStockStatus(product.stockHO);
  const qty = getQty(product.id);
  const Wrapper = isDesktop ? Modal : BottomSheet;

  return (
    <Wrapper open onClose={onClose} labelledBy="product-detail-title">
      <div className="flex flex-col gap-4">
        {isDesktop ? (
          <button type="button" onClick={onClose} className="text-left text-sm font-medium text-brand-700">
            ← Kembali ke Ringkasan Pesanan
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <h2 id="product-detail-title" className="text-lg font-semibold text-neutral-900">
              Detail Produk
            </h2>
            <button type="button" onClick={onClose} aria-label="Tutup">
              ✕
            </button>
          </div>
        )}

        <Image
          src={product.gallery[activeImage] ?? product.image}
          alt={product.name}
          width={352}
          height={240}
          className="h-60 w-full rounded-md object-cover"
        />
        <div className="flex gap-2">
          {product.gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveImage(index)}
              className={`h-20 w-20 overflow-hidden rounded-md border-2 ${
                index === activeImage ? "border-brand-600" : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt={`${product.name} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
        <h3 id={isDesktop ? "product-detail-title" : undefined} className="text-xl font-bold text-neutral-900">
          {product.name}
        </h3>
        <p className="text-lg font-semibold text-brand-700">{formatRupiah(product.price)} / pcs</p>
        <p className="text-sm text-neutral-500">Stok HO: {product.stockHO} pcs tersedia di Head Office.</p>

        <hr className="border-neutral-200" />
        <div>
          <p className="text-xs font-medium uppercase text-neutral-400">Deskripsi Produk</p>
          <p className="mt-1 text-sm text-neutral-700">{product.description}</p>
        </div>

        {isDesktop ? (
          <Button className="w-full" onClick={onClose}>
            Kembali ke Katalog
          </Button>
        ) : (
          status !== "habis" && (
            <>
              <hr className="border-neutral-200" />
              <div>
                <p className="text-xs font-medium uppercase text-neutral-400">Jumlah Pesanan</p>
                {qty > 0 ? (
                  <div className="mt-2">
                    <QuantityStepper
                      qty={qty}
                      stockHO={product.stockHO}
                      onIncrement={() => increment(product.id, product.stockHO)}
                      onDecrement={() => decrement(product.id)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => increment(product.id, product.stockHO)}
                    className="mt-2 h-20 w-24 rounded-md border border-brand-600 text-sm font-medium text-brand-700"
                  >
                    + Tambah
                  </button>
                )}
              </div>
              <Button className="w-full" onClick={onClose}>
                Tambah ke Keranjang
              </Button>
            </>
          )
        )}
      </div>
    </Wrapper>
  );
}
