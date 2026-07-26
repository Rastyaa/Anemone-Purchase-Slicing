# Anemone — Purchase Requests

Halaman internal untuk koordinator/owner outlet Anemone Indonesia memesan kebutuhan operasional (modul, perlengkapan, dll) ke Head Office.

- **Figma (view access):** https://www.figma.com/design/5DdsO7m1tuAHoYbo2tQacN/Anemone---Purchase-Requests
- **Repository:** https://github.com/Rastyaa/Anemone-Purchase-Slicing

## Menjalankan Project

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Tidak ada environment variable atau backend yang perlu disiapkan — semua data mock/lokal.

```bash
npm run build && npm run start   # production build
npm run lint                     # eslint
```

## Teknologi

- **Next.js 14 (App Router) + TypeScript** — struktur route sederhana (`/` dan `/order-history`), type-safety untuk data produk/cart/order.
- **Tailwind CSS** — warna, radius, dan breakpoint langsung dipetakan dari Figma variable defs (lihat `tailwind.config.ts`); token warnanya ternyata persis warna default Tailwind (teal/green/amber/red/blue/stone), jadi dialiaskan langsung tanpa hex custom.
- **React Context + `useReducer`** untuk cart (`src/lib/cart-context.tsx` + `cart-reducer.ts`), `useState` lokal untuk state per-komponen (metode pembayaran, filter, expand row, dll).
- Tidak ada backend — data dari `src/data/products.json` dan `src/data/orders.json`.

## Struktur Komponen

```
src/
  app/
    page.tsx                    Purchase Request (katalog + cart)
    order-history/page.tsx      Order History
  components/
    layout/                     Header, PageContainer
    ui/                         Button, Badge, QuantityStepper, EmptyState,
                                 Modal, BottomSheet, SuccessModal,
                                 LoadingOverlay, SearchInput — primitif generik,
                                 tidak tahu apa-apa soal domain produk/order
    catalog/ProductCard.tsx
    cart/                       CartSummary, CartItem, CostBreakdown, PaymentOption
    order-history/              OrderHistoryTable (desktop), OrderHistoryCardList
                                 (mobile), OrderDetailContent (dipakai bareng oleh
                                 keduanya), OrderStatusTimeline, FilterTabs,
                                 order-display.ts (label/tone/format bersama)
    product-detail/ProductDetailPanel.tsx
  lib/
    types.ts            Product, CartLine, Order, dll
    cart-reducer.ts      pure reducer (increment/decrement/remove/clear)
    cart-context.tsx     wiring tipis di atas reducer (useReducer + Provider)
    pricing.ts           calcSubtotal/calcTax/calcTotal/calcOrderSubtotal (pure)
    validation.ts        clampQty, isAtMinQty, isAtMaxStock, deriveStockStatus (pure)
    format.ts            formatRupiah
    order-id.ts          generateOrderId
    use-media-query.ts   useIsDesktop() — dipakai buat pilih Modal/BottomSheet
                         dan layout cart inline/bottom-sheet
  data/
    products.json, orders.json
```

Business logic (validasi qty, hitung harga, derive status) sengaja dipisah ke `lib/` sebagai pure function — komponen React cuma manggil, gak nyimpen logic itu sendiri.

## Keputusan UI/UX Utama

- **Product Detail Panel beda perilaku per breakpoint, dan ini disengaja.** Dari Figma: versi desktop cuma view-only (tombol "Kembali ke Katalog"), versi mobile punya section "Jumlah Pesanan" + tombol "Tambah ke Keranjang" (bisa add-to-cart langsung). Awalnya dikira ini salah gambar/tidak konsisten, tapi setelah dicek screenshot asli dua breakpoint tersebut memang beda — jadi diimplementasikan apa adanya, bukan disamakan.
- **Status stok & total pesanan dihitung, bukan disimpan.** `Product` tidak punya field `status` — dihitung dari `stockHO` (`deriveStockStatus`: habis jika 0, terbatas jika <20). `Order` juga tidak menyimpan `subtotal`/`tax`/`total` — dihitung dari `lines[].subtotal` — supaya tidak ada dua sumber kebenaran yang bisa saling beda.
- **Qty stepper selalu tampil begitu qty>0**, menggantikan tombol "+Tambah" — bukan dua kontrol terpisah yang harus disinkronkan manual.
- **Loading state ada dua lapis**: spinner di tombol submit (state disabled) DAN `LoadingOverlay` full-screen ("Memproses Pesanan...") — dua-duanya ada di Figma, jadi dua-duanya diimplementasikan, bukan disatukan jadi satu.
- **Validasi jumlah vs stok terlihat jelas**: tombol `+`/`-` di-disable dengan style solid (bg abu, bukan cuma opacity turun) supaya tetap terlihat saat disabled — versi awal pakai `opacity-40` di border tipis dan nyaris tidak terlihat, jadi bikin state "sudah maksimal stok" tidak jelas ke user.

## Asumsi

- Tidak ada backend nyata — submit order = simulasi (delay + generate order id lokal), refresh halaman = cart & riwayat baru kembali ke data mock awal (tidak persisten). Ini **known limitation**, bukan bug.
- Ambang batas "Stok Terbatas" diasumsikan `stockHO < 20` (tidak ada angka eksak di Figma, hanya label badge).
- Ongkir & pajak (11%) diasumsikan flat per pesanan (`ONGKIR = Rp 50.000`), mengikuti angka yang tampil di Figma untuk skenario cart yang dicontohkan.
- Data produk/order adalah mock (`src/data/*.json`). Foto produk pakai satu foto asli yang ada di source Figma (Product Detail Panel demo — foto tangan menulis worksheet calistung), dipakai berulang untuk 5 produk karena desain sumbernya sendiri tidak menyediakan foto berbeda per produk (instance `ProductCard` di katalog Figma masih placeholder text bawaan komponen, belum diisi data/foto asli).
