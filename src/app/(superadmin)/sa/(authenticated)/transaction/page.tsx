"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { SearchInput } from "@/components/ui/input";
import { useGetPurchase } from "../_services/purchase";
import { useState } from "react";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";
import { PaginationControls } from "@/components/pagination/page";
import { PurchasesDataTable } from "./_components/data-table";

export default function TransactionPage() {
  const [page, setPage] = useState(1);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  const { data: purchases, isFetching } = useGetPurchase({
    page: page.toString(),
    sort: "status",
    dir: "asc",
    search: search,
  });

  const purchasesList = purchases?.data?.list || [];
  const totalItems = purchases?.data?.total || 0;
  const itemsPerPage = purchases?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const handlePageReset = () => {
    setPage(1);
  };
  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Daftar Transaksi Penjualan Tiket
          </h1>
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Transaksi berdasarkan email/invoice"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
          </div>
        </div>

        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data transaksi..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Transaksi"
            emptyMessage="Belum ada transaksi penjualan tiket"
          />
        ) : (
          <div className="space-y-4">
            <div className="min-h-[490px]">
              <PurchasesDataTable purchases={purchasesList} />
            </div>

            <div className="flex items-start justify-end">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </SuperadminLayout>
  );
}
