import Link from "next/link";

interface HeaderProps {
  outletName: string;
}

export function Header({ outletName }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sm:px-10">
      <div className="flex items-center gap-4">
        <span className="font-heading text-lg font-bold text-brand-700">Anemone</span>
        <span className="hidden text-sm text-neutral-500 sm:inline">Cabang: {outletName}</span>
      </div>
      <Link href="/order-history" className="text-sm font-medium text-neutral-700 hover:text-brand-700">
        Order History
      </Link>
    </header>
  );
}
