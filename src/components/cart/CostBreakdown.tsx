import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { expedisiOptions } from "@/lib/expedisi";
import { formatRupiah } from "@/lib/format";

const expedisiDropdownOptions: DropdownOption<string>[] = expedisiOptions.map((option) => ({
  value: option.value,
  label: option.label,
  description: `Ongkir ${formatRupiah(option.ongkir)}`,
}));

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
          <Dropdown
            options={expedisiDropdownOptions}
            value={expedisiValue}
            onChange={onExpedisiChange}
            ariaLabel="Pilih ekspedisi"
            className="text-neutral-700"
          />
        </dd>
      </div>
      <div className="flex justify-between">
        <dt>Est. Ongkir</dt>
        <dd>{formatRupiah(ongkir)}</dd>
      </div>
    </dl>
  );
}
