"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { ConfirmSubmitModal } from "@/components/cart/ConfirmSubmitModal";
import { ProductCard } from "@/components/catalog/ProductCard";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProductDetailPanel } from "@/components/product-detail/ProductDetailPanel";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { SearchInput } from "@/components/ui/SearchInput";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { EmptySearchIcon } from "@/components/ui/icons";
import productsData from "@/data/products.json";
import { useCart } from "@/lib/cart-context";
import { catalogFilterOptions, filterProducts, type CatalogFilter } from "@/lib/catalog-filter";
import { DEFAULT_EXPEDISI_VALUE, getExpedisiLabel, getExpedisiOngkir } from "@/lib/expedisi";
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

export default function PurchaseRequestPage() {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { lines, clear } = useCart();
  const { outlet } = useOutlet();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [expedisiValue, setExpedisiValue] = useState(DEFAULT_EXPEDISI_VALUE);
  const [search, setSearch] = useState("");
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>("semua");
  const [pendingPayment, setPendingPayment] = useState<PaymentMethod | null>(null);

  const visibleProducts = filterProducts(products, search, catalogFilter);

  const ongkir = getExpedisiOngkir(expedisiValue);
  const subtotal = calcSubtotal(lines, products);
  const tax = calcTax(subtotal);
  const total = calcTotal(subtotal, tax, ongkir);
  const totalItems = lines.reduce((sum, line) => sum + line.qty, 0);

  function handleSubmit(paymentMethod: PaymentMethod) {
    if (isSubmitting) return;
    setPendingPayment(paymentMethod);
  }

  function handleConfirmedSubmit() {
    if (isSubmitting) return;
    setPendingPayment(null);
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
            <h2 className="font-heading text-lg font-bold text-neutral-900">Katalog Produk HO</h2>
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="xl:w-64">
                <SearchInput value={search} onChange={setSearch} placeholder="Cari produk..." />
              </div>
              <FilterTabs options={catalogFilterOptions} value={catalogFilter} onChange={setCatalogFilter} />
            </div>
            {visibleProducts.length === 0 ? (
              <EmptyState
                icon={<EmptySearchIcon />}
                title="Tidak ada produk yang cocok"
                description="Coba ubah kata kunci atau filter stok."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onViewDetail={setSelectedProduct} />
                ))}
              </div>
            )}
          </section>

          {isDesktop && (
            <aside className="flex h-fit max-h-[calc(100vh-3rem)] flex-col rounded-lg border border-neutral-200 p-6 lg:sticky lg:top-6">
              <h2 className="mb-4 shrink-0 font-heading text-lg font-bold text-neutral-900">Ringkasan Pesanan (Cart)</h2>
              {cartPanel}
            </aside>
          )}
        </div>
      </PageContainer>

      {!isDesktop && lines.length > 0 && (
        <button
          key={totalItems}
          type="button"
          onClick={() => setIsCartSheetOpen(true)}
          className="fixed inset-x-4 bottom-4 z-40 flex items-center justify-between rounded-md bg-brand-600 px-5 py-4 text-white shadow-lg motion-safe:animate-bump"
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
          <div className="mb-4 flex items-center justify-between">
            <h2 id="cart-sheet-title" className="font-heading text-lg font-bold text-neutral-900">
              Ringkasan Pesanan
            </h2>
            <button
              type="button"
              onClick={() => setIsCartSheetOpen(false)}
              aria-label="Tutup"
              className="-m-2 flex h-11 w-11 items-center justify-center text-lg text-neutral-500 hover:text-neutral-700"
            >
              ✕
            </button>
          </div>
          {cartPanel}
        </BottomSheet>
      )}

      <ProductDetailPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      {pendingPayment && (
        <ConfirmSubmitModal
          open
          itemCount={lines.length}
          totalQty={totalItems}
          total={total}
          paymentMethod={pendingPayment}
          expedisiLabel={getExpedisiLabel(expedisiValue)}
          outletName={outlet.name}
          onConfirm={handleConfirmedSubmit}
          onClose={() => setPendingPayment(null)}
        />
      )}
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
