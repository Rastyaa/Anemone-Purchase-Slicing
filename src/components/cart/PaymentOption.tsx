interface PaymentOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function PaymentOption({ label, selected, onSelect }: PaymentOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 ${
        selected ? "border-brand-600" : "border-neutral-300"
      }`}
    >
      <input
        type="radio"
        name="payment-method"
        checked={selected}
        onChange={onSelect}
        className="accent-brand-600"
      />
      <span className="text-sm font-medium text-neutral-900">{label}</span>
    </label>
  );
}
