"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { use, useEffect, useState } from "react";
import { useGetPlayingTeamById } from "../../../_services/playing-team";
import { PlayingTeam } from "../../../_models/response/playing-team";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetPlayingPlayers } from "../../../_services/playing-player";
import { PaginationControls } from "@/components/pagination/page";
import PlayerCard from "@/components/ui/player-card";
import Link from "next/link";
import { SearchInput } from "@/components/ui/input";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";

interface PlayingPlayerPageProps {
  params: Promise<{
    playingTeamId: string;
  }>;
}

export default function PlayingPlayer({ params }: PlayingPlayerPageProps) {
  const { playingTeamId } = use(params);
  const { data: playingTeamData, isFetching: isFetchingPlayingTeam } =
    useGetPlayingTeamById(playingTeamId);

  const [playingTeam, setPlayingTeam] = useState<PlayingTeam | null>(null);

  useEffect(() => {
    if (!isFetchingPlayingTeam) {
      setPlayingTeam(playingTeamData?.data || null);
    }
  }, [isFetchingPlayingTeam, playingTeamData]);

  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  // pagination
  const [page, setPage] = useState(1);
  const { data: playingPlayers, isFetching: isFetchingPlayingPlayers } = useGetPlayingPlayers({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    seasonTeamId: playingTeam?.id || "none",
    search: search,
  });

  const playingPlayersList = playingPlayers?.data?.list || [];
  const totalItems = playingPlayers?.data?.total || 0;
  const itemsPerPage = playingPlayers?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
              Daftar Player {playingTeam?.team?.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Pemain berdasarkan nama/nama panggung"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
            <Link
              href={`/sa/playing-team-data/${playingTeam?.id}/playing-player/create`}
            >
              <Button className="gap-2 text-white bg-blue-pfl">
                Tambah Pemain
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        {/* PlayingTeams Grid */}
        { isFetchingPlayingTeam || isFetchingPlayingPlayers ? (
          <LoadingCard loadingMessage="Sedang memuat data pemain..." />
        ) : totalItems === 0 ? (
          <EmptyCard 
          searchActive={hasActiveSearch}
          searchText={search}
          emptyTitle="Belum Ada Pemain"
          emptyMessage="Tambahkan Pemain Baru Untuk Membuat Daftar Pemain Tim Ini"
           />
        ) : (
          <div className="space-y-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
              {playingPlayersList.map((playingPLayer) => (
                <PlayerCard
                  key={playingPLayer.id}
                  player={playingPLayer}
                  actionButton
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
    </SuperadminLayout>
  );
}
