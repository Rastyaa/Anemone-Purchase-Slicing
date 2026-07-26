import { isAtMaxStock, isAtMinQty } from "@/lib/validation";

interface QuantityStepperProps {
  qty: number;
  stockHO: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
}

export function QuantityStepper({ qty, stockHO, onIncrement, onDecrement, onRemove }: QuantityStepperProps) {
  const atMin = isAtMinQty(qty);
  const atMax = isAtMaxStock(qty, stockHO);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDecrement}
          disabled={atMin}
          aria-label="Kurangi jumlah"
          className="h-8 w-8 rounded-md border border-neutral-300 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium text-neutral-900" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={atMax}
          aria-label="Tambah jumlah"
          className="h-8 w-8 rounded-md border border-neutral-300 text-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed"
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
