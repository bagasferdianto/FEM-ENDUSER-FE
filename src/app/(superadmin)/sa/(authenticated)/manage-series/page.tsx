"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SeriesDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";
import { useGetSeries } from "../_services/series";
import { useGetActiveSeason } from "../_services/season";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Season } from "../_models/response/season";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";
import { SearchInput } from "@/components/ui/input";

export default function ManageSeriesPage() {
  const [page, setPage] = useState(1);
  const { data: season, isFetching } = useGetActiveSeason();
  const router = useRouter();

  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  useEffect(() => {
    if (!isFetching) {
      if (season?.status === 400) {
        setActiveSeason(null);
        toast.error("Tidak terdapat season active");
        router.push("/sa/manage-season");
      } else {
        setActiveSeason(season?.data || null);
        if (!season?.data) {
          toast.error("Tidak terdapat season active");
          router.push("/sa/manage-season");
        }
      }
    }
  }, [season, router, isFetching]);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  const { data: series, isFetching: isFetchingSeries } = useGetSeries({
    page: page.toString(),
    sort: "status",
    dir: "asc",
    seasonId: activeSeason?.id || "none",
    search: search,
  });

  const seriesList = series?.data?.list || [];
  const totalItems = series?.data?.total || 0;
  const itemsPerPage = series?.data?.limit || 0;
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
            Daftar Series Pro Futsal League
          </h1>
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Series berdasarkan nama series"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
            <Link href={"/sa/manage-series/create"}>
              <Button className="gap-2 text-white bg-blue-pfl">
                Tambah Series Baru
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isFetching || isFetchingSeries ? (
          <LoadingCard loadingMessage="Sedang memuat data series..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Series"
            emptyMessage="Tambahkan Series Baru Untuk Membuat Data Series"
          />
        ) : (
          <div className="space-y-4">
            <SeriesDataTable series={seriesList} />

            <div className="flex items-start justify-between">
              <p className="text-sm">
                *note : Klik badge status untuk mengubah status series
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
