import { PlayingTeam } from "@/app/(superadmin)/sa/(authenticated)/_models/response/playing-team";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import ArrowRight from "@/app/assets/icon/arrow-right.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDeletePlayingTeam } from "@/app/(superadmin)/sa/(authenticated)/_services/playing-team";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { useQueryClient } from "@dhoniaridho/react-ohttp";

interface PlayingTeamCardProps {
  playingTeam: PlayingTeam;
  actionButton?: boolean;
  detailButton?: boolean;
  detailUrl?: string;
}

export default function PlayingTeamCard({
  playingTeam,
  actionButton = false,
  detailButton = false,
  detailUrl = "",
}: PlayingTeamCardProps) {
  // handle delete
  const deletePlayingTeam = useDeletePlayingTeam();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playingTeamToDelete, setPlayingTeamToDelete] = useState<PlayingTeam | null>(null);

  const queryClient = useQueryClient();

  const handleDeleteClick = (playingTeam: PlayingTeam) => {
    setPlayingTeamToDelete(playingTeam);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (playingTeamToDelete != null) {
      deletePlayingTeam.mutate(
        {
          vars: { id: playingTeamToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setPlayingTeamToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus season"
            );
          },
          onSuccess: () => {
            toast.success(`PlayingTeam "${playingTeamToDelete.team.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setPlayingTeamToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/season-teams"],
            });
          },
        }
      );
    }
  };

  return (
    <Card className="z-20 px-2 border-b-4 shadow-lg bg-club border-b-blue-pfl relative">
      <Image
        src={playingTeam?.team?.logo ?? ""}
        width={100}
        height={100}
        alt="LogoPlayingTeams"
        className="w-32 h-32 mx-auto object-contain"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild hidden={!actionButton}>
          <Ellipsis className="w-5 h-5 mx-auto mt-4 absolute top-0 right-3 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer font-medium"
              onClick={() => handleDeleteClick(playingTeam)}
            >
              Hapus Tim
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {detailButton ? (
        <Link
          href={detailUrl}
          className="cursor-pointer"
          hidden={!detailButton}
        >
          <div className="flex items-center mt-4 text-sm font-semibold justify-between h-10">
            <div className="text-sm text-center break-words">{playingTeam.team.name}</div>
            <Image src={ArrowRight} alt="ArrowRight" className="w-8 h-6" />
          </div>
        </Link>
      ) : (
        <div className="flex items-end mt-4 text-sm font-semibold justify-center h-10">
          <div className="text-sm text-center break-words">{playingTeam.team.name}</div>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Team Ini Dari Season?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-start gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
