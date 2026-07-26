export function EmptyCartIcon() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <path
          d="M10 13h16l-1.5 15a2 2 0 0 1-2 1.8h-9a2 2 0 0 1-2-1.8L10 13Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-brand-600"
        />
        <path
          d="M13 13v-2a5 5 0 0 1 10 0v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-brand-600"
        />
      </svg>
    </div>
  );
}

export function EmptyOrderHistoryIcon() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="9" y="8" width="18" height="22" rx="3" stroke="currentColor" strokeWidth="2" className="text-brand-600" />
        <path
          d="M14 7.5a2.5 2.5 0 0 1 5 0h3v3h-11v-3h3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          className="text-brand-600"
        />
        <path
          d="M13 17h10M13 22h10M13 27h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-brand-600"
        />
      </svg>
    </div>
  );
}
