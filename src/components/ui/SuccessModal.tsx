"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatRupiah } from "@/lib/format";

interface SuccessModalProps {
  open: boolean;
  orderId: string;
  itemCount: number;
  totalQty: number;
  total: number;
  outletName: string;
  onClose: () => void;
  onViewOrderHistory: () => void;
}

export function SuccessModal({
  open,
  orderId,
  itemCount,
  totalQty,
  total,
  outletName,
  onClose,
  onViewOrderHistory,
}: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="success-modal-title">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full opacity-60 blur-md"
            style={{ background: "conic-gradient(from 90deg, #0fa0af, #fdbb0e, #dc1f71, #0fa0af)" }}
          />
          <span
            aria-hidden="true"
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-3xl text-success-700 ring-4 ring-white"
          >
            ✓
          </span>
        </div>
        <h2 id="success-modal-title" className="text-xl font-bold text-neutral-900">
          Pesanan Berhasil Dibuat!
        </h2>
        <p className="rounded-full bg-neutral-100 px-4 py-1 text-sm font-medium text-neutral-700">
          No. Pesanan {orderId}
        </p>
        <p className="text-neutral-700">
          {itemCount} produk · {totalQty} pcs · {formatRupiah(total)}
        </p>
        <p className="text-sm text-neutral-500">Cabang: {outletName}</p>
        <p className="mt-2 rounded-md bg-neutral-50 p-3 text-sm text-neutral-500">
          Instruksi pembayaran akan dikirim ke email cabang terdaftar.
        </p>
        <Button className="mt-4 w-full" onClick={onViewOrderHistory}>
          Lihat Riwayat Pesanan
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Buat Pesanan Baru
        </Button>
      </div>
    </Modal>
  );
}
