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

- **Next.js 14 (App Router) + TypeScript** — dua route: `/` (Purchase Request) dan `/order-history`, type-safety untuk data produk/cart/order.
- **Tailwind CSS** — token warna **custom, diambil exact dari logo asli** `public/brand/anemone-logo.png` (teal `#08adc2`, magenta `#dc1964`, gold `#fec106`, disampling langsung dari file gambar), bukan alias warna default Tailwind. Lihat `tailwind.config.ts`.
- **React Context + `useReducer`** untuk cart (`src/lib/cart-context.tsx` + `cart-reducer.ts`) dan outlet aktif (`outlet-context.tsx`, dipasang global di `layout.tsx`). `useState` lokal untuk state per-komponen (metode pembayaran, ekspedisi, filter, expand row, dropdown open/close, dll).
- Tidak ada backend — data dari `src/data/products.json` dan `src/data/orders.json`.

## Struktur Komponen

```
src/
  app/
    layout.tsx                   Root layout — font, OutletProvider global
    page.tsx                     Purchase Request (katalog + cart)
    order-history/page.tsx       Order History
  components/
    layout/                      Header (logo + dropdown cabang), PageContainer
    ui/                          primitif generik, tidak tahu domain produk/order:
                                  Button, Badge, QuantityStepper, EmptyState,
                                  Modal, BottomSheet (drag-to-dismiss),
                                  SuccessModal, LoadingOverlay, SearchInput,
                                  Dropdown (listbox custom, keyboard nav),
                                  LoopGauge (signature ring indicator), icons.tsx
    catalog/ProductCard.tsx      grid card, stock gauge, quantity stepper
    cart/                        CartSummary, CartItem, CostBreakdown, PaymentOption
    order-history/                OrderHistoryTable (desktop), OrderHistoryCardList
                                  (mobile), OrderDetailContent (dipakai bareng
                                  keduanya), OrderStatusTimeline, FilterTabs,
                                  order-display.ts (label/tone/format bersama)
    product-detail/ProductDetailPanel.tsx   responsif: Modal (desktop) / BottomSheet (mobile)
  lib/
    types.ts            Product, CartLine, Order, dll
    cart-reducer.ts     pure reducer (increment/decrement/remove/clear)
    cart-context.tsx    wiring tipis di atas reducer (useReducer + Provider)
    outlets.ts / outlet-context.tsx   daftar outlet mock + context global
    expedisi.ts         opsi ekspedisi + ongkir masing-masing (selectable)
    pricing.ts          calcSubtotal/calcTax/calcTotal/calcOrderSubtotal (pure)
    validation.ts       clampQty, isAtMinQty, isAtMaxStock, deriveStockStatus (pure)
    format.ts           formatRupiah
    order-id.ts         generateOrderId
    use-media-query.ts  useIsDesktop() — satu breakpoint (1024px) untuk semua
                        keputusan responsif di app (Modal/BottomSheet, layout
                        cart inline/bottom-sheet, table/card-list)
  data/
    products.json, orders.json
public/
  brand/anemone-logo.png         logo asli (sumber token warna)
  products/modul-worksheet.png   satu foto produk asli dari Figma, dipakai
                                  berulang (lihat §Asumsi)
```

Business logic (validasi qty, hitung harga, derive status) sengaja dipisah ke `lib/` sebagai pure function — komponen React cuma manggil, gak nyimpen logic itu sendiri.

## Kenapa Tampilan Frontend Tidak 1:1 dengan Figma

Hasil implementasi **sengaja tidak persis** dengan file Figma, dan ini keputusan sadar — bukan penyimpangan yang tidak disengaja. Penjelasannya:

**Posisi Figma dalam pengerjaan ini.** File Figma dikerjakan lebih dulu dalam batas waktu yang sama, dan berperan sebagai acuan inti: informasi arsitektur, alur pemesanan, dan semua state wajib ditetapkan di sana dan **tetap diikuti frontend** — layout 2 kolom katalog+cart di desktop, sticky bar + bottom sheet cart di mobile, 5 state wajib (tersedia/terbatas/habis/ditambahkan/loading submit), validasi stok, halaman Order History dengan filter+timeline, hingga perilaku Product Detail Panel yang berbeda per breakpoint. Yang di-upgrade di frontend adalah **kualitas eksekusi visualnya**, bukan strukturnya.

**Kenapa visualnya di-upgrade, bukan disalin.** Beberapa hal baru diketahui/tersedia *setelah* Figma selesai, dan menyalin Figma apa adanya justru akan mengawetkan kekurangan yang sudah diketahui:

1. **Warna.** Figma memakai palet sementara yang identik dengan warna default Tailwind. Setelah file logo asli tersedia, warna brand yang sebenarnya (teal `#08adc2`, magenta `#dc1964`, gold `#fec106`) di-sampling langsung dari logo dan dijadikan token — hasilnya identitas visual yang benar-benar milik brand, bukan template.
2. **Aset.** Figma hanya punya placeholder ("pending image fill" untuk logo, kotak abu untuk foto produk). Frontend memakai logo asli dan satu-satunya foto asli yang ada di file Figma.
3. **Detail interaksi yang belum sempat dirancang di Figma** — dropdown cabang & ekspedisi dengan info per opsi, drag-to-dismiss bottom sheet, keyboard navigation, touch target 44px, indikator stok `LoopGauge` — ditambahkan di level kode karena lebih cepat diiterasi langsung di browser daripada digambar ulang dulu.

**Tujuannya:** menunjukkan dua kemampuan sekaligus sesuai brief — proses desain (wireframe → hi-fi di Figma) *dan* penilaian desain saat implementasi (mengenali kekurangan desain sendiri, memperbaikinya dengan alasan yang bisa dipertanggungjawabkan). Daripada mengirim frontend yang setia pada desain yang sudah diketahui kurang, lebih jujur mengirim frontend terbaik yang bisa dibuat dengan mendokumentasikan setiap penyimpangan — yang dirinci satu per satu di bagian berikut.

## Keputusan UI/UX Utama

- **Warna brand diambil exact dari logo asli**, bukan alias generic Tailwind. Awalnya pakai warna default Tailwind (teal/green/amber/red/blue/stone) yang terlihat generic/template — setelah user kasih file logo asli, warna di-sample langsung dari PNG-nya (teal, magenta, gold) dan dibikin full ramp 50-900 custom. Semua komponen sudah pakai nama semantik (`brand-*`, `success-*`, dst) sejak awal jadi perubahan ini tinggal di satu file `tailwind.config.ts`, tidak perlu ubah tiap komponen.
- **Signature visual: `LoopGauge`** — ring/loop kecil yang echo bentuk loop pada logo, dipakai konsisten di 2 tempat: indikator level stok di `ProductCard` (bukan cuma warna badge, tapi juga proporsi ring — supaya tidak color-only) dan marker "selesai" di `OrderStatusTimeline` — satu motif, dipakai berulang dengan tujuan fungsional, bukan dekorasi sekali pakai.
- **Product Detail Panel beda perilaku per breakpoint, dan ini disengaja.** Dari Figma: versi desktop view-only (cuma tombol "← Kembali", tombol "Kembali ke Katalog" yang redundan sudah dihapus), versi mobile punya section "Jumlah Pesanan" + tombol "Tambah ke Keranjang" (bisa add-to-cart langsung). Dikonfirmasi ke screenshot asli Figma tiap breakpoint — memang beda, bukan salah gambar, jadi diimplementasikan apa adanya.
- **Status stok & total pesanan dihitung, bukan disimpan.** `Product` tidak punya field `status` — dihitung dari `stockHO` (`deriveStockStatus`: habis jika 0, terbatas jika <20). `Order` juga tidak menyimpan `subtotal`/`tax`/`total` — dihitung dari `lines[].subtotal` — supaya tidak ada dua sumber kebenaran yang bisa saling beda.
- **Qty stepper selalu tampil begitu qty>0**, menggantikan tombol "+Tambah" — bukan dua kontrol terpisah yang harus disinkronkan manual. Status "Ditambahkan" pakai warna hijau (bukan warna aksen magenta brand) supaya tetap konsisten secara semantik dengan "berhasil/aktif"; magenta dipakai lebih spesifik sebagai aksen dekoratif satu momen saja (halo di `SuccessModal`).
- **Loading state ada dua lapis**: spinner di tombol submit (state disabled) DAN `LoadingOverlay` full-screen ("Memproses Pesanan...") — dua-duanya ada di Figma, jadi dua-duanya diimplementasikan, bukan disatukan jadi satu.
- **Dropdown cabang & ekspedisi pakai komponen custom** (`Dropdown.tsx`), bukan `<select>` native — supaya bisa nampilin detail per opsi (region/kode cabang, ongkir per ekspedisi) yang tidak bisa ditampilkan `<select>` biasa. Tetap dibuatkan keyboard navigation penuh (Arrow Up/Down/Home/End, auto-focus opsi terpilih, Escape/Tab menutup dan mengembalikan fokus ke trigger) supaya tidak kalah aksesibel dari native select yang digantikan.
- **Validasi jumlah vs stok terlihat jelas**: tombol `+`/`-` di-disable dengan style solid (bg abu, bukan cuma opacity turun) supaya tetap terlihat saat disabled — versi awal pakai `opacity-40` di border tipis dan nyaris tidak terlihat, jadi bikin state "sudah maksimal stok" tidak jelas ke user.
- **Konsistensi affordance tutup**: semua overlay mobile (Product Detail Sheet, Cart Sheet) punya tombol "✕" dengan touch target 44×44px (bukan cuma glyph tanpa padding) dan bisa drag-to-dismiss.

## Asumsi

- Tidak ada backend nyata — submit order = simulasi (delay + generate order id lokal), refresh halaman = cart & riwayat baru kembali ke data mock awal (tidak persisten). Ini **known limitation**, bukan bug.
- Ambang batas "Stok Terbatas" diasumsikan `stockHO < 20` (tidak ada angka eksak di Figma, hanya label badge).
- Ekspedisi (Cargo JNR/JNE Trucking/SiCepat Cargo) dan daftar cabang (Denpasar Utara II/Denpasar Selatan I/Kuta Utara) adalah **data mock buatan sendiri**, bukan data logistik/cabang riil Anemone — Figma hanya menunjukkan satu contoh ekspedisi (Cargo JNR) tanpa alternatif, jadi opsi tambahan beserta ongkirnya adalah asumsi untuk mendemokan interaksi "memilih ekspedisi" yang diminta brief.
- Data produk/order adalah mock (`src/data/*.json`). Foto produk pakai satu foto asli yang ada di source Figma (Product Detail Panel demo — foto tangan menulis worksheet calistung), dipakai berulang untuk 5 produk karena desain sumbernya sendiri tidak menyediakan foto berbeda per produk (instance `ProductCard` di katalog Figma masih placeholder text bawaan komponen, belum diisi data/foto asli).
