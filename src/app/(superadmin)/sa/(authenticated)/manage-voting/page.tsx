"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen, Plus } from "lucide-react";
import { useState } from "react";
import { useGetVotings } from "../_services/voting";
import { VotingsDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";

export default function ManageVotingPage() {
  const [page, setPage] = useState(1);

  const votings = useGetVotings({
    page: page.toString(),
    sort: "status",
    dir: "asc",
  });

  const votingsList = votings.data?.data?.list || [];
  const totalItems = votings.data?.data?.total || 0;
  const itemsPerPage = votings.data?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Kelola Voting Pro Futsal League
          </h1>
          <Link href={"/sa/manage-voting/create"}>
            <Button className="gap-2 text-white bg-blue-pfl">
              Tambah Voting Baru
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Voting
              </h3>
              <p className="text-muted-foreground text-center">
                Tambahkan Voting Baru Untuk Membuat Data Voting
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <VotingsDataTable votings={votingsList} />

            <div className="flex items-end justify-end">
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
