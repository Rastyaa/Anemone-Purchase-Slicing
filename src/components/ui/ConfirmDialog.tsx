"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Batal",
  danger = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="confirm-dialog-title">
      <div className="flex flex-col gap-4">
        <h2 id="confirm-dialog-title" className="font-heading text-lg font-bold text-neutral-900">
          {title}
        </h2>
        <p className="text-sm text-neutral-700">{description}</p>
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button variant={danger ? "danger" : "primary"} className="sm:flex-1" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" className="sm:flex-1" onClick={onClose}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
