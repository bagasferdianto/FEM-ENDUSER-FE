"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useGetVotings } from "../_services/voting";
import { VotingsDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";

export default function ManageVotingPage() {
  const [page, setPage] = useState(1);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  // get data
  const { data: votings, isFetching } = useGetVotings({
    page: page.toString(),
    sort: "status",
    dir: "asc",
    search: search,
  });

  const votingsList = votings?.data?.list || [];
  const totalItems = votings?.data?.total || 0;
  const itemsPerPage = votings?.data?.limit || 0;
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
            Kelola Voting Pro Futsal League
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchInput
                placeholder="Cari Voting berdasarkan judul voting"
                onSearch={handleSearch}
                onPageReset={handlePageReset}
              />
            </div>
            <Link href={"/sa/manage-voting/create"}>
              <Button className="gap-2 text-white bg-blue-pfl">
                Tambah Voting Baru
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data voting..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Voting"
            emptyMessage="Tambahkan Voting Baru Untuk Membuat Data Voting"
          />
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
