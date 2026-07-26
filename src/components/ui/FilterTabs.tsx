interface FilterTabsProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function FilterTabs<T extends string>({ options, value, onChange }: FilterTabsProps<T>) {
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            value === option.value ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
