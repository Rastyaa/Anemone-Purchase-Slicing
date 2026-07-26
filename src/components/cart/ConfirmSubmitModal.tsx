"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatRupiah } from "@/lib/format";
import { paymentMethodLabel } from "@/lib/payment";
import type { PaymentMethod } from "@/lib/types";

interface ConfirmSubmitModalProps {
  open: boolean;
  itemCount: number;
  totalQty: number;
  total: number;
  paymentMethod: PaymentMethod;
  expedisiLabel: string;
  outletName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmSubmitModal({
  open,
  itemCount,
  totalQty,
  total,
  paymentMethod,
  expedisiLabel,
  outletName,
  onConfirm,
  onClose,
}: ConfirmSubmitModalProps) {
  const rows = [
    { label: "Cabang", value: outletName },
    { label: "Item", value: `${itemCount} produk · ${totalQty} pcs` },
    { label: "Metode Pembayaran", value: paymentMethodLabel[paymentMethod] },
    { label: "Ekspedisi", value: expedisiLabel },
  ];

  return (
    <Modal open={open} onClose={onClose} labelledBy="confirm-submit-title">
      <div className="flex flex-col gap-4">
        <h2 id="confirm-submit-title" className="font-heading text-xl font-bold text-neutral-900">
          Konfirmasi Pesanan
        </h2>
        <dl className="flex flex-col gap-2 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-4">
              <dt className="text-neutral-500">{row.label}</dt>
              <dd className="text-right font-medium text-neutral-900">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
          <p className="font-semibold text-neutral-900">TOTAL TAGIHAN</p>
          <p className="font-bold text-brand-700">{formatRupiah(total)}</p>
        </div>
        <Button className="w-full" onClick={onConfirm}>
          Konfirmasi & Kirim
        </Button>
        <Button variant="secondary" className="w-full" onClick={onClose}>
          Periksa Lagi
        </Button>
      </div>
    </Modal>
  );
}
