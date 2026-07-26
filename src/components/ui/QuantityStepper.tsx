"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { clampQty, isAtMaxStock, isAtMinQty } from "@/lib/validation";

interface QuantityStepperProps {
  qty: number;
  stockHO: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onQtyChange: (qty: number) => void;
  onRemove?: () => void;
}

export function QuantityStepper({ qty, stockHO, onIncrement, onDecrement, onQtyChange, onRemove }: QuantityStepperProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const atMin = isAtMinQty(qty);
  const atMax = isAtMaxStock(qty, stockHO);

  function commitDraft() {
    if (draft === null) return;
    if (draft !== "") {
      const next = clampQty(parseInt(draft, 10), stockHO);
      if (next !== qty) onQtyChange(next);
    }
    setDraft(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") event.currentTarget.blur();
    if (event.key === "Escape") setDraft(null);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={atMin}
          aria-label="Kurangi jumlah"
          className="h-8 w-8 rounded-md border border-neutral-300 text-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-300"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={draft ?? String(qty)}
          onChange={(event) => {
            if (/^\d*$/.test(event.target.value)) setDraft(event.target.value);
          }}
          onFocus={(event) => event.target.select()}
          onBlur={commitDraft}
          onKeyDown={handleKeyDown}
          aria-label="Jumlah pesanan"
          className="h-8 w-12 rounded-md border border-neutral-300 text-center text-sm font-medium text-neutral-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="button"
          onClick={onIncrement}
          disabled={atMax}
          aria-label="Tambah jumlah"
          className="h-8 w-8 rounded-md border border-neutral-300 text-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-300"
        >
          +
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Hapus dari keranjang"
            className="ml-1 text-danger-600 hover:text-danger-700"
          >
            🗑
          </button>
        )}
      </div>
      {atMax && (
        <p className="text-xs text-danger-600" role="alert">
          Melebihi stok tersedia (maks: {stockHO})
        </p>
      )}
    </div>
  );
}
