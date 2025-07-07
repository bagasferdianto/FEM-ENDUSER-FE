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
  DropdownMenuItem,
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@dhoniaridho/react-ohttp";
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

// RequiredLabel tidak ada di shadcn, saya asumsikan ini adalah komponen custom Anda.
// Jika tidak, Anda bisa menggantinya dengan FormLabel biasa.
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel>
    {children} <span className="text-destructive">*</span>
  </FormLabel>
);

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

  // --- CHANGE START: Update Zod Schema ---
  const schema = z.object({
    seasonTeamPlayerId: z.string().nonempty("Player wajib dipilih"),
    performance: z.object({
      teamLeaderboard: z.coerce
        .number({ invalid_type_error: "Peringkat tim harus berupa angka" })
        .min(0, "Peringkat tim tidak boleh negatif"),
      goal: z.coerce
        .number({ invalid_type_error: "Goal harus berupa angka" })
        .min(0, "Goal tidak boleh negatif"),
      assist: z.coerce
        .number({ invalid_type_error: "Assist harus berupa angka" })
        .min(0, "Assist tidak boleh negatif"),
      save: z.coerce
        .number({ invalid_type_error: "Save harus berupa angka" })
        .min(0, "Save tidak boleh negatif"),
    }),
  });

  type FormData = z.infer<typeof schema>;
  // --- CHANGE END: Update Zod Schema ---

  const form = useForm<FormData>({
    mode: "all",
    resolver: zodResolver(schema),
    // --- CHANGE START: Update Default Values ---
    defaultValues: {
      seasonTeamPlayerId: "",
      performance: {
        teamLeaderboard: 0,
        goal: 0,
        assist: 0,
        save: 0,
      },
    },
    // --- CHANGE END: Update Default Values ---
  });

  const updateCandidate = useUpdateCandidate();
  const queryClient = useQueryClient();
  const [id, setId] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CHANGE START: Update setUpdateForm function ---
  const setUpdateForm = (data: Candidate) => {
    form.setValue("seasonTeamPlayerId", data.seasonTeamPlayer.id);
    form.setValue("performance.teamLeaderboard", data.performance.teamLeaderboard);
    form.setValue("performance.goal", data.performance.goal);
    form.setValue("performance.assist", data.performance.assist);
    form.setValue("performance.save", data.performance.save);
    setId(data.id);
    setOpenModal(true);
  };
  // --- CHANGE END: Update setUpdateForm function ---

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    updateCandidate.mutate(
      {
        vars: { id: id },
        body: data, // Struktur data sudah sesuai dengan schema baru
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat memperbarui player"
          );

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
      {/* --- CHANGE START: Update Table Structure --- */}
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead className="w-[150px]">Nama Player</TableHead>
            <TableHead className="w-[150px]">Team</TableHead>
            <TableHead className="w-[80px]">Goal</TableHead>
            <TableHead className="w-[80px]">Assist</TableHead>
            <TableHead className="w-[80px]">Save</TableHead>
            <TableHead className="w-[80px]">Skor</TableHead>
            <TableHead className="w-[100px]">Total Vote</TableHead>
            <TableHead className="w-[100px]">Presentase</TableHead>
            <TableHead className="w-[50px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate, index) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="truncate">
                {candidate.seasonTeamPlayer.player.name}
              </TableCell>
              <TableCell className="truncate">
                {candidate.seasonTeam.team.name}
              </TableCell>
              <TableCell>{candidate.performance.goal}</TableCell>
              <TableCell>{candidate.performance.assist}</TableCell>
              <TableCell>{candidate.performance.save}</TableCell>
              <TableCell>{candidate.performance.score}</TableCell>
              <TableCell>{candidate.voters.count} Voters</TableCell>
              <TableCell>{candidate.voters.percentage} %</TableCell>
              <TableCell className="text-right">
                {/* --- CHANGE END: Update Table Structure --- */}
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

      {/* --- CHANGE START: Update Dialog/Modal Content --- */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Data Kandidat</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="seasonTeamPlayerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <RequiredLabel>Pilih Player/Pemain</RequiredLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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

              <div className="space-y-4 pt-2">
                <FormLabel>Performa</FormLabel>

                <FormField
                  control={form.control}
                  name="performance.teamLeaderboard"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-4">
                        <FormLabel className="w-1/2 text-sm font-normal">
                          Peringkat Team :
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Peringkat Team pada Leaderboard"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="pl-[calc(35%)]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performance.goal"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-4">
                        <FormLabel className="w-1/2 text-sm font-normal">
                          Jumlah Gol :
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Masukkan Jumlah Gol"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="pl-[calc(35%)]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performance.assist"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-4">
                        <FormLabel className="w-1/2 text-sm font-normal">
                          Jumlah Assist :
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Masukkan Jumlah Assist"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="pl-[calc(35%)]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="performance.save"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-4">
                        <FormLabel className="w-1/2 text-sm font-normal">
                          Jumlah Save :
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Masukkan Jumlah Save"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="pl-[calc(35%)]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-blue-pfl flex items-center justify-center hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Perbarui Kandidat
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* --- CHANGE END: Update Dialog/Modal Content --- */}

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
