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

- **Next.js 14 (App Router) + TypeScript** — dua route: `/` (Purchase Request) dan `/order-history`, type-safety untuk data produk/cart/order. `app/template.tsx` menambahkan animasi transisi halaman tanpa library eksternal (lihat §Keputusan UI/UX).
- **Tailwind CSS** — token warna **custom, diambil exact dari logo asli** `public/brand/anemone-logo.png` (teal `#08adc2`, magenta `#dc1964`, gold `#fec106`, disampling langsung dari file gambar), bukan alias warna default Tailwind. Semua animasi (entrance modal/sheet, transisi halaman, bump feedback) juga didefinisikan sebagai keyframes Tailwind — tidak ada dependency animasi tambahan (Framer Motion dsb). Lihat `tailwind.config.ts`.
- **React Context + `useReducer`** untuk cart (`src/lib/cart-context.tsx` + `cart-reducer.ts`, persist ke `localStorage`) dan outlet aktif (`outlet-context.tsx`). Keduanya dipasang global di `layout.tsx` sehingga state tidak reset saat pindah halaman. `useState` lokal untuk state per-komponen (metode pembayaran, ekspedisi, filter, expand row, dropdown open/close, dll).
- Tidak ada backend — data dari `src/data/products.json` dan `src/data/orders.json`.

## Struktur Komponen

```
src/
  app/
    layout.tsx                   Root layout — font, OutletProvider + CartProvider global
    template.tsx                 Animasi transisi tiap perpindahan halaman
    page.tsx                     Purchase Request (katalog + cart)
    order-history/page.tsx       Order History
  components/
    layout/                      Header (logo + dropdown cabang), PageContainer
    ui/                          primitif generik, tidak tahu domain produk/order:
                                  Button, Badge, QuantityStepper (qty bisa diketik),
                                  EmptyState, Modal, BottomSheet (drag-to-dismiss),
                                  ConfirmDialog, SuccessModal, LoadingOverlay,
                                  SearchInput, FilterTabs (pola ARIA tablist penuh),
                                  Dropdown (listbox custom, keyboard nav),
                                  LoopGauge (signature ring indicator), icons.tsx
    catalog/ProductCard.tsx      grid card, stock gauge, quantity stepper, tint kategori
    cart/                        CartSummary (scroll internal + footer pinned), CartItem
                                  (qty bisa diedit langsung), CostBreakdown, PaymentOption,
                                  ConfirmSubmitModal (ringkasan sebelum submit)
    order-history/               OrderHistoryTable (desktop), OrderHistoryCardList
                                  (mobile), OrderDetailContent (tombol "Pesan Lagi",
                                  dipakai bareng keduanya), OrderStatusTimeline,
                                  order-display.ts (label/tone/format bersama)
    product-detail/ProductDetailPanel.tsx   responsif: Modal (desktop) / BottomSheet (mobile)
  lib/
    types.ts             Product (+ category), CartLine, Order (OrderLine + productId), dll
    cart-reducer.ts      pure reducer (increment/decrement/setQty/addMany/hydrate/remove/clear)
    cart-context.tsx     wiring reducer + persist/hydrate localStorage
    outlets.ts / outlet-context.tsx   daftar outlet mock + context global
    expedisi.ts          opsi ekspedisi + ongkir masing-masing (selectable)
    payment.ts           opsi & label metode pembayaran (satu sumber, dipakai 2 tempat)
    catalog-filter.ts    filterProducts() pure — search + filter stok katalog
    reorder.ts           buildReorderLines() pure — pemetaan order lama ke cart baru
    pricing.ts           calcSubtotal/calcTax/calcTotal/calcOrderSubtotal (pure)
    validation.ts        clampQty, isAtMinQty, isAtMaxStock, deriveStockStatus (pure)
    format.ts            formatRupiah
    order-id.ts          generateOrderId
    use-media-query.ts   useIsDesktop() — satu breakpoint (1024px) untuk semua
                         keputusan responsif di app
    use-focus-trap.ts    focus-trap dipakai bersama oleh Modal & BottomSheet
    use-reduced-motion.ts  deteksi prefers-reduced-motion untuk animasi drag/transisi
  data/
    products.json, orders.json
public/
  brand/anemone-logo.png         logo asli (sumber token warna)
  products/modul-worksheet.png   satu foto produk asli dari Figma, dipakai
                                  berulang (lihat §Asumsi)
```

Business logic (validasi qty, hitung harga, derive status, filter katalog, pemetaan reorder) sengaja dipisah ke `lib/` sebagai pure function — komponen React cuma manggil, gak nyimpen logic itu sendiri.

## Kenapa Tampilan Frontend Tidak 1:1 dengan Figma

Hasil implementasi **sengaja tidak persis** dengan file Figma, dan ini keputusan sadar — bukan penyimpangan yang tidak disengaja. Penjelasannya:

**Posisi Figma dalam pengerjaan ini.** File Figma dikerjakan lebih dulu dalam batas waktu yang sama, dan berperan sebagai acuan inti: informasi arsitektur, alur pemesanan, dan semua state wajib ditetapkan di sana dan **tetap diikuti frontend** — layout 2 kolom katalog+cart di desktop, sticky bar + bottom sheet cart di mobile, 5 state wajib (tersedia/terbatas/habis/ditambahkan/loading submit), validasi stok, halaman Order History dengan filter+timeline, hingga perilaku Product Detail Panel yang berbeda per breakpoint. Yang di-upgrade di frontend adalah **kualitas eksekusi visual dan efisiensi interaksinya**, bukan strukturnya.

**Kenapa visualnya di-upgrade, bukan disalin.** Beberapa hal baru diketahui/tersedia *setelah* Figma selesai, dan menyalin Figma apa adanya justru akan mengawetkan kekurangan yang sudah diketahui:

1. **Warna.** Figma memakai palet sementara yang identik dengan warna default Tailwind. Setelah file logo asli tersedia, warna brand yang sebenarnya (teal `#08adc2`, magenta `#dc1964`, gold `#fec106`) di-sampling langsung dari logo dan dijadikan token — hasilnya identitas visual yang benar-benar milik brand, bukan template.
2. **Aset.** Figma hanya punya placeholder ("pending image fill" untuk logo, kotak abu untuk foto produk). Frontend memakai logo asli dan satu-satunya foto asli yang ada di file Figma.
3. **Detail interaksi yang belum sempat dirancang di Figma** — dropdown cabang & ekspedisi dengan info per opsi, drag-to-dismiss bottom sheet, keyboard navigation, touch target 44px, indikator stok `LoopGauge`, hingga efisiensi alur pemesanan (qty bisa diketik, edit qty langsung dari cart, reorder dari riwayat, cart persisten) — ditambahkan/dinaikkan levelnya di kode karena lebih cepat diiterasi langsung di browser daripada digambar ulang dulu di Figma.

**Tujuannya:** menunjukkan dua kemampuan sekaligus sesuai brief — proses desain (wireframe → hi-fi di Figma) *dan* penilaian desain saat implementasi (mengenali kekurangan desain sendiri, memperbaikinya dengan alasan yang bisa dipertanggungjawabkan). Daripada mengirim frontend yang setia pada desain yang sudah diketahui kurang, lebih jujur mengirim frontend terbaik yang bisa dibuat dengan mendokumentasikan setiap penyimpangan — yang dirinci satu per satu di bagian berikut.

## Keputusan UI/UX Utama

**Fondasi (dari implementasi awal):**

- **Warna brand diambil exact dari logo asli**, bukan alias generic Tailwind. Semua komponen pakai nama semantik (`brand-*`, `success-*`, dst) sehingga ganti palet cukup di satu file `tailwind.config.ts`.
- **Signature visual: `LoopGauge`** — ring/loop kecil yang echo bentuk loop pada logo, dipakai konsisten di indikator level stok `ProductCard` (proporsi ring, bukan cuma warna — supaya tidak color-only) dan marker "selesai" di `OrderStatusTimeline`.
- **Product Detail Panel beda perilaku per breakpoint, dan ini disengaja** — desktop view-only, mobile bisa add-to-cart langsung — dikonfirmasi ke screenshot asli Figma tiap breakpoint, bukan salah gambar.
- **Status stok & total pesanan dihitung, bukan disimpan** — `deriveStockStatus`, `calcOrderSubtotal`, dst — supaya tidak ada dua sumber kebenaran yang bisa saling beda.
- **Loading state dua lapis**: spinner di tombol submit DAN `LoadingOverlay` full-screen — dua-duanya ada di Figma, jadi dua-duanya diimplementasikan.
- **Dropdown cabang & ekspedisi pakai komponen custom**, bukan `<select>` native — supaya bisa nampilin detail per opsi (region/kode cabang, ongkir per ekspedisi), dengan keyboard navigation penuh (Arrow/Home/End/Escape) supaya tidak kalah aksesibel dari native select yang digantikan.
- **Konsistensi affordance tutup**: semua overlay mobile punya tombol "✕" dengan touch target 44×44px dan bisa drag-to-dismiss.

**Efisiensi pemesanan (upgrade di atas versi awal):**

- **Jumlah pesanan bisa diketik langsung**, bukan cuma tombol ±1 — memesan 50 pcs semula butuh 50 klik. `QuantityStepper` sekarang punya input angka yang di-clamp ke stok saat blur/Enter.
- **Qty bisa diubah langsung dari keranjang** — sebelumnya `CartItem` cuma bisa dihapus, harus balik ke katalog untuk ubah jumlah.
- **Tombol "Pesan Lagi" di Order History** — use case utama outlet (pesan barang yang sama tiap periode) sebelumnya tidak punya jalan pintas sama sekali. Jumlah otomatis menyesuaikan stok HO saat ini, item yang stoknya habis dilewati dengan pemberitahuan.
- **Keranjang persist ke `localStorage`** — refresh tidak lagi menghapus pesanan yang sedang disusun (riwayat pesanan tetap mock, tidak persisten — lihat §Asumsi).
- **Pencarian + filter stok di katalog**, pola yang sama seperti Order History, supaya katalog HO yang lebih besar dari 5 produk mock tetap bisa di-scan cepat.
- **Konfirmasi sebelum submit order** — ringkasan singkat (cabang, item, metode, ekspedisi, total) sebelum order benar-benar terkirim, mengurangi risiko misklik pada pesanan bernilai besar.
- **Konfirmasi sebelum menghapus item / sebelum reorder** — aksi destruktif (hapus dari keranjang, baik di katalog maupun di cart) dan aksi massal (reorder mengisi banyak baris sekaligus) sekarang lewat `ConfirmDialog` dulu. Menambah produk ke keranjang ("+ Tambah") sengaja tetap satu klik — itu aksi yang paling sering dipakai dan tidak destruktif.

**Polish visual & motion:**

- **Animasi transisi antar halaman** (`app/template.tsx`) dan entrance untuk Modal/BottomSheet — Next.js me-remount `template.tsx` di setiap navigasi, jadi animasi fade+rise otomatis replay tanpa library tambahan, dan karena provider cart/outlet ada di `layout.tsx` (di luar template), state tidak ikut reset.
- **Semua animasi di belakang `motion-safe:`** — pengguna dengan `prefers-reduced-motion` mendapat perilaku instan, termasuk transisi drag-snap `BottomSheet` (dicek lewat `usePrefersReducedMotion`).
- **Tint kategori pada foto produk** — karena hanya ada satu foto asli yang dipakai berulang (lihat §Asumsi), tiap kategori produk (Modul/Perlengkapan/Dekorasi/Buku) diberi gradient tint warna brand + chip label supaya tetap bisa dibedakan sekilas.

**Aksesibilitas:**

- **Focus-trap pada semua Modal & BottomSheet** (`useFocusTrap`, dipakai bersama) — fokus otomatis pindah ke dalam dialog saat dibuka, Tab/Shift+Tab terkurung di dalamnya, dan fokus dikembalikan ke tombol pemicu saat ditutup.
- **`FilterTabs` mengikuti pola ARIA tablist penuh** — roving tabindex, navigasi Arrow/Home/End, bukan sekadar `role="tab"` tanpa perilakunya.
- **`aria-label` menyebut nama produk secara spesifik** di setiap tombol `QuantityStepper` (kurangi/tambah/hapus/input jumlah) — sebelumnya identik di semua produk sehingga screen reader tidak bisa membedakan produk mana yang sedang difokus.
- **Kontras teks informasional dinaikkan** dari `neutral-400` ke `neutral-500` (label kecil, header tabel, deskripsi opsi dropdown) yang sebelumnya berada di bawah ambang AA di atas latar warm-paper.

## Asumsi

- Tidak ada backend nyata — submit order = simulasi (delay + generate order id lokal). **Keranjang persisten via `localStorage`**, tapi **riwayat pesanan (Order History) tetap mock/tidak persisten** — order baru yang disubmit tidak benar-benar menambah baris di `orders.json`. Ini **known limitation**, bukan bug.
- Ambang batas "Stok Terbatas" diasumsikan `stockHO < 20` (tidak ada angka eksak di Figma, hanya label badge).
- Ekspedisi (Cargo JNR/JNE Trucking/SiCepat Cargo) dan daftar cabang (Denpasar Utara II/Denpasar Selatan I/Kuta Utara) adalah **data mock buatan sendiri**, bukan data logistik/cabang riil Anemone.
- **Kategori produk** (Modul/Perlengkapan/Dekorasi/Buku, dipakai untuk tint kartu katalog) adalah pengelompokan yang dibuat sendiri berdasarkan nama produk — tidak ada taksonomi kategori resmi di Figma maupun brief.
- **"Pesan Lagi" mencocokkan produk berdasarkan `productId`**, bukan mengulang harga/snapshot historis — jumlah di-clamp ke stok HO saat ini, dan harga yang dipakai adalah harga produk saat ini (bukan harga historis di pesanan lama), karena tidak ada mekanisme harga historis di sistem mock ini.
- Data produk/order adalah mock (`src/data/*.json`). Foto produk pakai satu foto asli yang ada di source Figma (Product Detail Panel demo — foto tangan menulis worksheet calistung), dipakai berulang untuk 5 produk karena desain sumbernya sendiri tidak menyediakan foto berbeda per produk.
