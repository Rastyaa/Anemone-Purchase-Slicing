"use client";

import Image from "next/image";
import Link from "next/link";
import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { useOutlet } from "@/lib/outlet-context";
import { outlets } from "@/lib/outlets";

const outletOptions: DropdownOption<string>[] = outlets.map((item) => ({
  value: item.id,
  label: item.name,
  description: item.region,
}));

export function Header() {
  const { outlet, setOutletId } = useOutlet();

  return (
    <header className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-white px-4 py-4 sm:gap-4 sm:px-10">
      <div className="flex min-w-0 items-center gap-1 sm:gap-3">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/anemone-logo.png"
            alt="Anemone Indonesia"
            width={140}
            height={38}
            priority
            className="h-6 w-auto sm:h-9"
          />
        </Link>
        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-neutral-200" />
        <Dropdown
          options={outletOptions}
          value={outlet.id}
          onChange={setOutletId}
          ariaLabel="Pilih cabang"
          trigger={(selected) => (
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="text-brand-600">
                🏬
              </span>
              <span className="max-w-[5rem] truncate sm:max-w-none">{selected?.label}</span>
            </span>
          )}
        />
      </div>
      <Link
        href="/order-history"
        className="shrink-0 whitespace-nowrap text-sm font-medium text-neutral-700 hover:text-brand-700"
      >
        <span className="sm:hidden">Riwayat</span>
        <span className="hidden sm:inline">Riwayat Pesanan</span>
      </Link>
    </header>
  );
}
