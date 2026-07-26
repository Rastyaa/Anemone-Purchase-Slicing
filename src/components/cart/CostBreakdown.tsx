import { expedisiOptions } from "@/lib/expedisi";
import { formatRupiah } from "@/lib/format";

interface CostBreakdownProps {
  subtotal: number;
  tax: number;
  expedisiValue: string;
  onExpedisiChange: (value: string) => void;
  ongkir: number;
}

export function CostBreakdown({ subtotal, tax, expedisiValue, onExpedisiChange, ongkir }: CostBreakdownProps) {
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
      <div className="flex items-center justify-between">
        <dt>Expedisi</dt>
        <dd>
          <select
            value={expedisiValue}
            onChange={(event) => onExpedisiChange(event.target.value)}
            aria-label="Pilih ekspedisi"
            className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-sm text-neutral-700 focus:border-brand-600 focus:outline-none"
          >
            {expedisiOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </dd>
      </div>
      <div className="flex justify-between">
        <dt>Est. Ongkir</dt>
        <dd>{formatRupiah(ongkir)}</dd>
      </div>
    </dl>
  );
}
