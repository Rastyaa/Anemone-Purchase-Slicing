"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductDetailPanel } from "@/components/product-detail/ProductDetailPanel";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { SuccessModal } from "@/components/ui/SuccessModal";
import productsData from "@/data/products.json";
import { CartProvider, useCart } from "@/lib/cart-context";
import { DEFAULT_EXPEDISI_VALUE, getExpedisiOngkir } from "@/lib/expedisi";
import { formatRupiah } from "@/lib/format";
import { generateOrderId } from "@/lib/order-id";
import { useOutlet } from "@/lib/outlet-context";
import { calcSubtotal, calcTax, calcTotal } from "@/lib/pricing";
import { useIsDesktop } from "@/lib/use-media-query";
import type { PaymentMethod, Product } from "@/lib/types";

const products = productsData as Product[];

interface CompletedOrder {
  id: string;
  itemCount: number;
  totalQty: number;
  total: number;
}

function PurchaseRequestContent() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { lines, clear } = useCart();
  const { outlet } = useOutlet();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [expedisiValue, setExpedisiValue] = useState(DEFAULT_EXPEDISI_VALUE);

  const ongkir = getExpedisiOngkir(expedisiValue);
  const subtotal = calcSubtotal(lines, products);
  const tax = calcTax(subtotal);
  const total = calcTotal(subtotal, tax, ongkir);
  const totalItems = lines.reduce((sum, line) => sum + line.qty, 0);

  function handleSubmit(_paymentMethod: PaymentMethod) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      setCompletedOrder({
        id: generateOrderId(),
        itemCount: lines.length,
        totalQty: totalItems,
        total,
      });
      clear();
      setIsSubmitting(false);
      setIsCartSheetOpen(false);
    }, 1800);
  }

  const cartPanel = (
    <CartSummary
      products={products}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      expedisiValue={expedisiValue}
      onExpedisiChange={setExpedisiValue}
      ongkir={ongkir}
    />
  );

  return (
    <>
      <Header />
      <PageContainer>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Purchase Requests</h1>
        <p className="mt-1 text-neutral-500">Form Pemesanan Stock Cabang (Purchase Order)</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <section className="flex flex-col gap-4 pb-24 lg:pb-0">
            <h2 className="text-lg font-semibold text-neutral-900">Katalog Produk HO</h2>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onViewDetail={setSelectedProduct} />
            ))}
          </section>

          {isDesktop && (
            <aside className="h-fit rounded-lg border border-neutral-200 p-6 lg:sticky lg:top-6">
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">Ringkasan Pesanan (Cart)</h2>
              {cartPanel}
            </aside>
          )}
        </div>
      </PageContainer>

      {!isDesktop && lines.length > 0 && (
        <button
          type="button"
          onClick={() => setIsCartSheetOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-md bg-brand-600 px-5 py-4 text-white shadow-lg"
        >
          <span className="text-sm font-medium">
            {totalItems} item · {formatRupiah(total)}
          </span>
          <span className="text-sm font-semibold">Lihat Keranjang →</span>
        </button>
      )}

      {!isDesktop && (
        <BottomSheet
          open={isCartSheetOpen}
          onClose={() => setIsCartSheetOpen(false)}
          labelledBy="cart-sheet-title"
        >
          <h2 id="cart-sheet-title" className="mb-4 text-lg font-semibold text-neutral-900">
            Ringkasan Pesanan
          </h2>
          {cartPanel}
        </BottomSheet>
      )}

      <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <LoadingOverlay open={isSubmitting} />
      {completedOrder && (
        <SuccessModal
          open
          orderId={completedOrder.id}
          itemCount={completedOrder.itemCount}
          totalQty={completedOrder.totalQty}
          total={completedOrder.total}
          outletName={outlet.name}
          onClose={() => setCompletedOrder(null)}
          onViewOrderHistory={() => {
            setCompletedOrder(null);
            router.push("/order-history");
          }}
        />
      )}
    </>
  );
}

export default function PurchaseRequestPage() {
  return (
    <CartProvider>
      <PurchaseRequestContent />
    </CartProvider>
  );
}
