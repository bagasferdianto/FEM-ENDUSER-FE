"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { use, useEffect, useState } from "react";
import { useGetPlayingTeamById } from "../../../_services/playing-team";
import { PlayingTeam } from "../../../_models/response/playing-team";
import { Button } from "@/components/ui/button";
import { PackageOpen, Plus } from "lucide-react";
import { useGetPlayingPlayers } from "../../../_services/playing-player";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationControls } from "@/components/pagination/page";
import PlayerCard from "@/components/ui/player-card";
import Link from "next/link";

interface PlayingPlayerPageProps {
  params: Promise<{
    playingTeamId: string;
  }>;
}

export default function PlayingPlayer({ params }: PlayingPlayerPageProps) {
  const { playingTeamId } = use(params);
  const { data: playingTeamData, isFetching } =
    useGetPlayingTeamById(playingTeamId);

  const [playingTeam, setPlayingTeam] = useState<PlayingTeam | null>(null);

  useEffect(() => {
    if (!isFetching) {
      setPlayingTeam(playingTeamData?.data || null);
    }
  }, [isFetching, playingTeamData]);

  // pagination
  const [page, setPage] = useState(1);
  const playingPlayers = useGetPlayingPlayers({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    seasonTeamId: playingTeam?.id || "none",
  });

  const playingPlayersList = playingPlayers.data?.data?.list || [];
  const totalItems = playingPlayers.data?.data?.total || 0;
  const itemsPerPage = playingPlayers.data?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isFetching) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Memuat data tim yang bermain...
            </p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

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

          <Link
            href={`/sa/playing-team-data/${playingTeam?.id}/playing-player/create`}
          >
            <Button className="gap-2 text-white bg-blue-pfl">
              Tambah Pemain
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        {/* PlayingTeams Grid */}
        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">Belum Ada Pemain</h3>
              <p className="text-muted-foreground text-center">
                Tambahkan Pemain Baru Untuk Membuat Daftar Pemain Tim Ini
              </p>
            </CardContent>
          </Card>
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
