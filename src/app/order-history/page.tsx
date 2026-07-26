"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterTabs } from "@/components/ui/FilterTabs";
import { OrderHistoryCardList } from "@/components/order-history/OrderHistoryCardList";
import { OrderHistoryTable } from "@/components/order-history/OrderHistoryTable";
import { Header } from "@/components/layout/Header";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyOrderHistoryIcon } from "@/components/ui/icons";
import { SearchInput } from "@/components/ui/SearchInput";
import ordersData from "@/data/orders.json";
import { useIsDesktop } from "@/lib/use-media-query";
import type { Order, OrderStatus } from "@/lib/types";

const orders = ordersData as Order[];

type FilterValue = OrderStatus | "semua";

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "diproses", label: "Diproses" },
  { value: "dikirim", label: "Dikirim" },
  { value: "selesai", label: "Selesai" },
  { value: "dibatalkan", label: "Dibatalkan" },
];

export default function OrderHistoryPage() {
  const isDesktop = useIsDesktop();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("semua");

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === "semua" || order.status === filter;
      const matchesSearch = order.id.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  return (
    <>
      <Header />
      <PageContainer>
        <Link href="/" className="text-sm font-medium text-brand-700">
          ← Kembali ke Purchase Request
        </Link>
        <h1 className="mt-3 font-heading text-2xl font-bold text-neutral-900">Riwayat Pesanan</h1>
        <p className="mt-1 text-neutral-500">Pantau status pesanan stock yang sudah diajukan ke Head Office.</p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Cari no. PR..." />
          </div>
          <FilterTabs options={filterOptions} value={filter} onChange={setFilter} ariaLabel="Filter status pesanan" />
        </div>

        <div className="mt-6">
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={<EmptyOrderHistoryIcon />}
              title="Belum ada riwayat pesanan"
              description="Pesanan yang kamu ajukan ke Head Office akan muncul di sini."
            />
          ) : isDesktop ? (
            <OrderHistoryTable orders={filteredOrders} />
          ) : (
            <OrderHistoryCardList orders={filteredOrders} />
          )}
        </div>
      </PageContainer>
    </>
  );
}
