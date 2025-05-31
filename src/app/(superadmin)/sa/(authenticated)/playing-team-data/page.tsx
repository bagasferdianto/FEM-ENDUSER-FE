"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { useGetPlayingTeams } from "../_services/playing-team";
import { PackageOpen, Plus } from "lucide-react";
import PlayingTeamCard from "@/components/ui/playing-team-card";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination/page";
import { useGetActiveSeason } from "../_services/season";
import { Season } from "../_models/response/season";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ManageTeamsDialog } from "./_components/manage-team-dialog";

export default function PlayingTeamDataPage() {
  // fetch active season
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

  // pagination
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const playingTeams = useGetPlayingTeams({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    seasonId: activeSeason?.id || "",
  });

  const playingTeamsList = playingTeams.data?.data?.list || [];
  const totalItems = playingTeams.data?.data?.total || 0;
  const itemsPerPage = playingTeams.data?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (isFetching) {
      return (
        <SuperadminLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat data season...</p>
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
              Data Tim Yang Bermain di {activeSeason?.name}
            </h1>
          </div>

          <Button className="gap-2 text-white bg-blue-pfl" onClick={() => setOpen(true)}>
            Tambah Data Tim Yang Bermain
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* PlayingTeams Grid */}
        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Tim Yang Bermain
              </h3>
              <p className="text-muted-foreground text-center">
                Silahkan Tambahkan Data Tim Yang Bermain
              </p>
            </CardContent>
          </Card>
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
