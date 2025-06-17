"use client";

import { Button } from "@/components/ui/button";
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
import { Loader2, MoreVertical } from "lucide-react";
import { type Player } from "../../_models/response/player";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeletePlayer, useUpdatePlayer } from "../../_services/player";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "react-ohttp";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

interface PlayersDataTableProps {
  players: Player[];
}

export function PlayersDataTable({ players }: PlayersDataTableProps) {
  // handle update dialog
  const schema = z.object({
    name: z.string().nonempty("Nama player wajib diisi"),
    stageName: z.string().nullable().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      stageName: undefined,
    },
  });

  const updatePlayer = useUpdatePlayer();
  const queryClient = useQueryClient();
  const [id, setId] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUpdateForm = (data: Player) => {
    form.setValue("name", data.name);
    form.setValue("stageName", data.stageName ?? null);
    setId(data.id);
    setOpenModal(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    updatePlayer.mutate(
      {
        vars: { id: id },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat memperbarui team"
          );

          // Handle validation errors
          if (error.status === 422) {
            const validationErrors = error.data.validation as Partial<
              Record<keyof FormData, string>
            >;

            Object.entries(validationErrors).forEach(([field, message]) => {
              if (message) {
                form.setError(field as keyof FormData, {
                  type: "manual",
                  message,
                });
              }
            });
          }

          setIsSubmitting(false);
        },
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Player berhasil diperbarui");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/players"],
          });
          setOpenModal(false);
        },
      }
    );
  };

  // handle delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const deletePlayer = useDeletePlayer();
  const handleDeleteClick = (player: Player) => {
    setPlayerToDelete(player);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (playerToDelete) {
      deletePlayer.mutate(
        {
          vars: { id: playerToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setPlayerToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus player"
            );
          },
          onSuccess: () => {
            toast.success(`Player "${playerToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setPlayerToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/players"],
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
            <TableHead className="w-1/5 text-muted-foreground">No</TableHead>
            <TableHead className="w-1/2 text-muted-foreground">
              Nama Lengkap
            </TableHead>
            <TableHead className="w-1/2 text-muted-foreground">
              Nama Panggung
            </TableHead>
            <TableHead className="w-1/2 text-muted-foreground">
              Tanggal Ditambahkan
            </TableHead>
            <TableHead className="w-1/12 text-muted-foreground text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={player.id}>
              <TableCell className="truncate max-w-xs font-medium">
                {index + 1}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {player.name}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {player.stageName ?? "-"}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {formatDate(player.createdAt)}
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
                      className="cursor-pointer font-medium"
                      onClick={() => setUpdateForm(player)}
                    >
                      Edit Data Player
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer font-medium"
                      onClick={() => handleDeleteClick(player)}
                    >
                      Delete Player
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="sr-only">Edit Player</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Masukkan Nama Player</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nama Lengkap Player" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stageName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Masukkan Nama Panggung (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? null : val);
                        }}
                        placeholder="Nama Panggung Player"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="bg-blue-pfl flex items-center justify-center text-white w-min"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Perbarui Player
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Player Ini?
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
