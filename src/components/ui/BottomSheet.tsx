"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export function BottomSheet({ open, onClose, children, labelledBy }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-neutral-900/40">
      <button type="button" aria-label="Tutup" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-white p-4 shadow-xl"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-300" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
