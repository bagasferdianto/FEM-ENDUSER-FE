import { PlayingPlayer } from "@/app/(superadmin)/sa/(authenticated)/_models/response/playing-player";
import Image from "next/image";
import PemainBanner from "@/app/assets/images/banner-pemain.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useDeletePlayingPlayer } from "@/app/(superadmin)/sa/(authenticated)/_services/playing-player";
import { useState } from "react";
import { useQueryClient } from "react-ohttp";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";

interface PlayerCardProps {
  player: PlayingPlayer;
  actionButton?: boolean;
}

export default function PlayerCard({
  player,
  actionButton = false,
}: PlayerCardProps) {
  // handle delete
  const deletePlayingPlayer = useDeletePlayingPlayer();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playingPlayerToDelete, setPlayingPlayerToDelete] =
    useState<PlayingPlayer | null>(null);

  const queryClient = useQueryClient();

  const handleDeleteClick = (playingPlayer: PlayingPlayer) => {
    setPlayingPlayerToDelete(playingPlayer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (playingPlayerToDelete != null) {
      deletePlayingPlayer.mutate(
        {
          vars: { id: playingPlayerToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setPlayingPlayerToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus season"
            );
          },
          onSuccess: () => {
            toast.success(
              `PlayingPlayer "${playingPlayerToDelete.player.name}" berhasil dihapus`
            );
            setDeleteDialogOpen(false);
            setPlayingPlayerToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/season-team-players"],
            });
          },
        }
      );
    }
  };

  return (
    <div key={player.id} className="flex items-center relative w-fit mt-6">
      <div className="relative">
        <div className="absolute z-10 px-2 text-white bottom-0 pb-3 w-full bg-gradient-to-t from-black/80 to-transparent">
          <div className="text-sm font-semibold">
            {player?.player.name}
          </div>
          <div className="text-xs font-light">{player?.position ?? "NA"}</div>
        </div>
        <Image
          src={player?.image?.url ?? ""}
          width={150}
          height={200}
          alt="FotoPemain"
          className="z-10 rounded-l-lg h-52 object-cover"
        />
      </div>
      <Image
        src={PemainBanner}
        className="rounded-r-lg h-52"
        alt="PemainBanner"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild hidden={!actionButton}>
          <Ellipsis className="w-6 h-6 mx-auto mt-4 cursor-pointer absolute -top-2 right-2 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link
                href={`/sa/playing-team-data/${player?.seasonTeam?.id}/playing-player/${player?.id}/edit`}
              >
                Edit Pemain
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleDeleteClick(player)}
            >
              Hapus Pemain
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Player Ini Dari Team?
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
    </div>
  );
}
