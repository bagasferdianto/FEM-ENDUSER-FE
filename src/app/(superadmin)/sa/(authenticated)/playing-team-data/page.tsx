"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { useGetPlayingTeams } from "../_services/playing-team";
import { Plus } from "lucide-react";
import PlayingTeamCard from "@/components/ui/playing-team-card";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination/page";
import { useGetActiveSeason } from "../_services/season";
import { Season } from "../_models/response/season";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ManageTeamsDialog } from "./_components/manage-team-dialog";
import { SearchInput } from "@/components/ui/input";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";

export default function PlayingTeamDataPage() {
  // fetch active season
  const { data: season, isFetching: isFetchingSeason } = useGetActiveSeason();
  const router = useRouter();

  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  useEffect(() => {
    if (!isFetchingSeason) {
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
  }, [season, router, isFetchingSeason]);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  // pagination
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: playingTeams, isFetching: isFetchingPlayingTeams } =
    useGetPlayingTeams({
      page: page.toString(),
      sort: "createdAt",
      dir: "desc",
      seasonId: activeSeason?.id || "none",
      search: search,
    });

  const playingTeamsList = playingTeams?.data?.list || [];
  const totalItems = playingTeams?.data?.total || 0;
  const itemsPerPage = playingTeams?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };
  const handlePageReset = () => {
    setPage(1);
  };

  return (
    <SuperadminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Data Tim Yang Bermain di {activeSeason?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Tim berdasarkan nama tim"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
            <Button
              className="gap-2 text-white bg-blue-pfl"
              onClick={() => setOpen(true)}
            >
              Tambah Data Tim Yang Bermain
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PlayingTeams Grid */}
        {isFetchingSeason || isFetchingPlayingTeams ? (
          <LoadingCard loadingMessage="Sedang memuat data tim yang bermain..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Tim Yang Bermain"
            emptyMessage="Silahkan Tambahkan Data Tim Yang Bermain Baru"
          />
        ) : (
          <div className="space-y-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {playingTeamsList.map((playingTeam) => (
                <PlayingTeamCard
                  key={playingTeam.id}
                  playingTeam={playingTeam}
                  actionButton
                  detailButton
                  detailUrl={`/sa/playing-team-data/${playingTeam.id}/playing-player`}
                />
              ))}
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

      <ManageTeamsDialog open={open} onOpenChange={setOpen} />
    </SuperadminLayout>
  );
}
