"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RequiredLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-ohttp";
import { toast } from "sonner";
import { z } from "zod";
import { Candidate } from "../../_models/response/candidate";
import {
  useDeleteCandidate,
  useUpdateCandidate,
} from "../../_services/candidate";
import { Loader2, MoreVertical } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPlayingPlayers } from "../../_services/playing-player";

interface CandidatesDataTableProps {
  candidates: Candidate[];
}

export default function CandidatesDataTable({
  candidates,
}: CandidatesDataTableProps) {
  // get season team player for dropdown
  const seasonTeamPlayer = useGetPlayingPlayers({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
  });

  const seasonTeamPlayers = seasonTeamPlayer.data?.data?.list || [];
  // handle update dialog
  const schema = z.object({
    seasonTeamPlayerId: z.string().nonempty("Player wajid dipilih"),
    performance: z.string().nonempty("Performa wajib diisi"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      seasonTeamPlayerId: "",
      performance: "",
    },
  });

  const updateCandidate = useUpdateCandidate();
  const queryClient = useQueryClient();
  const [id, setId] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUpdateForm = (data: Candidate) => {
    form.setValue("seasonTeamPlayerId", data.seasonTeamPlayer.id);
    form.setValue("performance", data.performance);
    setId(data.id);
    setOpenModal(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    updateCandidate.mutate(
      {
        vars: { id: id },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat memperbarui player"
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
            queryKey: ["/superadmin/candidates"],
          });
          setOpenModal(false);
        },
      }
    );
  };

  // handle delete candidate
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(
    null
  );
  const deleteCandidate = useDeleteCandidate();

  const handleDeleteClick = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (candidateToDelete) {
      deleteCandidate.mutate(
        {
          vars: { id: candidateToDelete.id },
        },
        {
          onSuccess: () => {
            toast.success(
              `Player "${candidateToDelete.seasonTeamPlayer.player.name}" berhasil dihapus`
            );
            setDeleteDialogOpen(false);
            setCandidateToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/candidates"],
            });
          },
          onError: (error) => {
            console.log(error);
            setDeleteDialogOpen(false);
            setCandidateToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus player"
            );
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
            <TableHead className="w-[20px]">No</TableHead>
            <TableHead className="w-[100px]">Nama Player</TableHead>
            <TableHead className="w-[100px]">Team</TableHead>
            <TableHead className="w-[100px]">Performa</TableHead>
            <TableHead className="w-[100px]">Total Vote</TableHead>
            <TableHead className="w-[100px]">Presentase</TableHead>
            <TableHead className="w-[20px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell className="truncate max-w-xs font medium">
                {index + 1}
              </TableCell>
              <TableCell className="truncate max-w-xs font medium">
                {candidate.seasonTeamPlayer.player.name}
              </TableCell>
              <TableCell className="truncate max-w-xs font medium">
                {candidate.seasonTeam.team.name}
              </TableCell>
              <TableCell className="truncate max-w-xs font medium">
                {candidate.performance}
              </TableCell>
              <TableCell className="truncate max-w-xs font medium">
                {candidate.voters.count}
              </TableCell>
              <TableCell className="truncate max-w-xs font medium">
                {candidate.voters.percentage}
              </TableCell>
              <TableCell className="text-right">
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
                      onClick={() => setUpdateForm(candidate)}
                    >
                      Edit Data Kandidat
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer font-medium text-destructive"
                      onClick={() => handleDeleteClick(candidate)}
                    >
                      Hapus Data Kandidat
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
            <DialogTitle>Update Data Kandidat</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-center justify-center space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="seasonTeamPlayerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <RequiredLabel>Pilih Player</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto w-full">
                        {seasonTeamPlayers.map((seasonTeamPlayer) => (
                          <SelectItem
                            key={seasonTeamPlayer.id}
                            value={seasonTeamPlayer.id}
                          >
                            {seasonTeamPlayer.player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="performance"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Masukkan Performa</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Masukkan Performa" />
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
                Perbarui Kandidat
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Kandidat Ini?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-start gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteConfirm()}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
