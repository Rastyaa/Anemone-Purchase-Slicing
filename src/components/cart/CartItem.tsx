import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

interface CartItemProps {
  product: Product;
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}

export function CartItem({ product, qty, onIncrement, onDecrement, onQtyChange, onRemove }: CartItemProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm font-medium text-neutral-900">{product.name}</p>
          <p className="text-xs text-neutral-500">{formatRupiah(product.price)} / pcs</p>
        </div>
        <QuantityStepper
          qty={qty}
          stockHO={product.stockHO}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onQtyChange={onQtyChange}
        />
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-neutral-900">{formatRupiah(product.price * qty)}</p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Hapus ${product.name} dari keranjang`}
          className="text-danger-600 hover:text-danger-700"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
