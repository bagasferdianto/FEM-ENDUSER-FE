"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import {
  type Season,
  StatusEnum,
  StatusRequestEnum,
} from "../../_models/response/season";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteSeason, useUpdateStatusSeason } from "../../_services/season";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-ohttp";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

interface SeasonsDataTableProps {
  seasons: Season[];
}

export function SeasonsDataTable({ seasons }: SeasonsDataTableProps) {
  const schema = z.object({
    status: z.nativeEnum(StatusRequestEnum),
  });

  const form = useForm<z.infer<typeof schema>>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const [id, setId] = useState<string>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seasonToDelete, setSeasonToDelete] = useState<Season | null>(null);

  const updateStatus = useUpdateStatusSeason();
  const deleteSeason = useDeleteSeason();
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = form.handleSubmit((data) => {
    updateStatus.mutate(
      {
        vars: { id: id as string },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message || "Terjadi kesalahan");
        },
        onSuccess: () => {
          toast.success("Status season berhasil diubah");
          form.reset();
          router.push("/sa/manage-season");
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/seasons"],
          });
        },
      }
    );
  });

  const handleDeleteClick = (season: Season) => {
    setSeasonToDelete(season);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (seasonToDelete) {
      deleteSeason.mutate(
        {
          vars: { id: seasonToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setSeasonToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus season"
            );
          },
          onSuccess: () => {
            toast.success(`Season "${seasonToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setSeasonToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/seasons"],
            });
          },
        }
      );
    }
  };

  return (
    <div className="rounded-xl border overflow-x-auto">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 text-muted-foreground">Nama Season</TableHead>
            <TableHead className="w-1/3 text-muted-foreground">Logo Season</TableHead>
            <TableHead className="w-1/3 text-muted-foreground">Banner Season</TableHead>
            <TableHead className="w-1/12 text-muted-foreground">Status</TableHead>
            <TableHead className="w-1/12 text-muted-foreground text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seasons.map((season) => (
            <TableRow key={season.id}>
              <TableCell className="truncate max-w-xs font-medium">{season.name}</TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                <a
                  href={season.logo.url}
                  className="text-blue-600 hover:underline whitespace-nowrap"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {season.logo.name}
                </a>
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                <a
                  href={season.banner.url}
                  className="text-blue-600 hover:underline whitespace-nowrap"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {season.banner.name}
                </a>
              </TableCell>
              <TableCell>
                <DropdownMenu onOpenChange={() => setId(season.id)}>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className={cn(
                        season.status === StatusEnum.Active
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-500 hover:bg-gray-600",
                        "rounded-full text-white cursor-pointer"
                      )}
                    >
                      {season.status === StatusEnum.Active
                        ? "Active"
                        : "Non-Active"}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="flex justify-center"
                      onClick={() => {
                        form.setValue("status", StatusRequestEnum.Active);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-green-500 hover:bg-green-600 rounded-full text-white">
                        Active
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex justify-center"
                      onClick={() => {
                        form.setValue("status", StatusRequestEnum.Inactive);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-gray-500 hover:bg-gray-600 rounded-full text-white">
                        Non-Active
                      </Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      asChild
                    >
                      <Link href={`/sa/manage-season/${season.id}/edit`}>
                      Edit Season
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() => handleDeleteClick(season)}
                    >
                      Delete Season
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Season Ini?
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
