interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
      <span aria-hidden="true" className="text-neutral-400">
        🔍
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </div>
  );
}
