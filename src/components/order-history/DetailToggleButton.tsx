interface DetailToggleButtonProps {
  expanded: boolean;
  onClick: () => void;
  controlsId: string;
}

export function DetailToggleButton({ expanded, onClick, controlsId }: DetailToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={controlsId}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1 ${
        expanded
          ? "border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-700"
          : "border-neutral-300 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      {expanded ? "Tutup Detail" : "Lihat Detail"}
      <svg
        width="10"
        height="10"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className={`shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      >
        <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
