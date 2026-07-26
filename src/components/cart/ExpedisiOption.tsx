interface ExpedisiOptionProps {
  label: string;
  ongkir: string;
  selected: boolean;
  onSelect: () => void;
}

export function ExpedisiOption({ label, ongkir, selected, onSelect }: ExpedisiOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 ${
        selected ? "border-brand-600" : "border-neutral-300"
      }`}
    >
      <span className="flex items-center gap-3">
        <input type="radio" name="expedisi" checked={selected} onChange={onSelect} className="accent-brand-600" />
        <span className="text-sm font-medium text-neutral-900">{label}</span>
      </span>
      <span className="text-sm text-neutral-500">{ongkir}</span>
    </label>
  );
}
