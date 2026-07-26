"use client";

import Link from "next/link";
import { useOutlet } from "@/lib/outlet-context";
import { outlets } from "@/lib/outlets";

function AnemoneLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="8" r="5" className="fill-brand-300" />
      <circle cx="20" cy="14" r="5" className="fill-brand-500" />
      <circle cx="14" cy="20" r="5" className="fill-brand-700" />
      <circle cx="8" cy="14" r="5" className="fill-brand-500" />
      <circle cx="14" cy="14" r="4" className="fill-brand-900" />
    </svg>
  );
}

export function Header() {
  const { outlet, setOutletId } = useOutlet();

  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sm:px-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <AnemoneLogo />
          <span className="font-heading text-lg font-bold text-brand-700">Anemone</span>
        </Link>
        <label className="hidden items-center gap-1 text-sm text-neutral-500 sm:flex">
          Cabang:
          <select
            value={outlet.id}
            onChange={(event) => setOutletId(event.target.value)}
            aria-label="Pilih cabang"
            className="rounded-md border border-transparent bg-transparent font-medium text-neutral-700 hover:border-neutral-300 focus:border-brand-600 focus:outline-none"
          >
            {outlets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Link href="/order-history" className="text-sm font-medium text-neutral-700 hover:text-brand-700">
        Order History
      </Link>
    </header>
  );
}
