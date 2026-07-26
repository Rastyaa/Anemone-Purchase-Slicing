import { formatRupiah } from "@/lib/format";

interface CostBreakdownProps {
  subtotal: number;
  tax: number;
  expedisi: string;
  ongkir: number;
}

export function CostBreakdown({ subtotal, tax, expedisi, ongkir }: CostBreakdownProps) {
  const rows = [
    { label: "Subtotal", value: formatRupiah(subtotal) },
    { label: "Tax (11%)", value: formatRupiah(tax) },
    { label: "Expedisi", value: expedisi },
    { label: "Est. Ongkir", value: formatRupiah(ongkir) },
  ];

  return (
    <dl className="flex flex-col gap-2 text-sm text-neutral-500">
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between">
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
