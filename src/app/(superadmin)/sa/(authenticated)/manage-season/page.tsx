"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGetSeasons } from "../_services/season";
import { SeasonsDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import EmptyCard from "@/components/ui/empty-card";
import LoadingCard from "@/components/ui/loading";

export default function ManageSeasonPage() {
  const [page, setPage] = useState(1);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  const { data: seasons, isFetching } = useGetSeasons({
    page: page.toString(),
    sort: "status",
    dir: "asc",
    search: search,
  });

  const seasonsList = seasons?.data?.list || [];
  const totalItems = seasons?.data?.total || 0;
  const itemsPerPage = seasons?.data?.limit || 0;
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
            Daftar Season Pro Futsal League
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchInput
                placeholder="Cari Season berdasarkan nama season"
                onSearch={handleSearch}
                onPageReset={handlePageReset}
              />
            </div>
            <Link href={"/sa/manage-season/create"}>
              <Button className="gap-2 text-white bg-blue-pfl">
                Tambah Season Baru
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data season..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Season"
            emptyMessage="Tambahkan Season Baru Untuk Membuat Data Season"
          />
        ) : (
          <div className="space-y-4">
            <SeasonsDataTable seasons={seasonsList} />

            <div className="flex items-start justify-between">
              <p className="text-sm">
                *note : hanya 1 data season yang bisa aktif
              </p>
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
