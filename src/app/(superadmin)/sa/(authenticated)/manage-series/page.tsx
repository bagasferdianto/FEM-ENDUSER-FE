"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SeriesDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";
import { useGetSeries } from "../_services/series";
import { useGetActiveSeason } from "../_services/season";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Season } from "../_models/response/season";

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

  const { data: series, isFetching: isFetchingSeries } = useGetSeries({
    page: page.toString(),
    sort: "status",
    dir: "asc",
    seasonId: activeSeason?.id || "none",
  });

  const seriesList = series?.data?.list || [];
  const totalItems = series?.data?.total || 0;
  const itemsPerPage = series?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isFetching || isFetchingSeries) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data series...</p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Daftar Series Pro Futsal League
          </h1>
          <Link href={"/sa/manage-series/create"}>
            <Button className="gap-2 text-white bg-blue-pfl">
              Tambah Series Baru
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Series
              </h3>
              <p className="text-muted-foreground text-center">
                Tambahkan Series Baru Untuk Membuat Data Series
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <SeriesDataTable series={seriesList} />

            <div className="flex items-start justify-between">
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
