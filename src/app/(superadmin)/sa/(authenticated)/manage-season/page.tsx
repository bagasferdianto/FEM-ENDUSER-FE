"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import { useGetSeasons } from "../_services/season";
import { SeasonsDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";

export default function ManageSeasonPage() {
  const [page, setPage] = useState(1);

  const seasons = useGetSeasons({
    page: page.toString(),
  });

  const seasonsList = seasons.data?.data?.list || [];
  const totalItems = seasons.data?.data?.total || 0;
  const itemsPerPage = seasons.data?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Daftar Season Pro Futsal League
          </h1>
          <Link href={"/sa/manage-season/create"}>
            <Button className="gap-2 text-white bg-blue-pfl">
              <Plus className="h-4 w-4" />
              Tambah Season Baru
            </Button>
          </Link>
        </div>

        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Season
              </h3>
              <p className="text-muted-foreground text-center">
                Tambahkan Season Baru Untuk Membuat Data Season
              </p>
            </CardContent>
          </Card>
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
