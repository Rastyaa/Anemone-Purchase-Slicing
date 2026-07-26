import { formatRupiah } from "@/lib/format";

interface CostBreakdownProps {
  subtotal: number;
  tax: number;
  expedisiLabel: string;
  ongkir: number;
}

export function CostBreakdown({ subtotal, tax, expedisiLabel, ongkir }: CostBreakdownProps) {
  return (
    <dl className="flex flex-col gap-2 text-sm text-neutral-500">
      <div className="flex justify-between">
        <dt>Subtotal</dt>
        <dd>{formatRupiah(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Tax (11%)</dt>
        <dd>{formatRupiah(tax)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Expedisi</dt>
        <dd className="font-medium text-neutral-700">{expedisiLabel}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Est. Ongkir</dt>
        <dd>{formatRupiah(ongkir)}</dd>
      </div>
    </dl>
  );
}
