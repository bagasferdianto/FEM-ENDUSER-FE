"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, PackageOpen, Plus, SquareArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetVotingById } from "../../../_services/voting";
import { Button } from "@/components/ui/button";
import CandidatesDataTable from "../../_components/data-table-candidate";
import {
  useCreateCandidate,
  useGetCandidates,
} from "../../../_services/candidate";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
  RequiredLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetPlayingPlayers } from "../../../_services/playing-player";
import { toast } from "sonner";
import { useQueryClient } from "react-ohttp";
import { useGetActiveSeason } from "../../../_services/season";

export default function ManageCandidatePage() {
  const params = useParams();
  const votingId = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // --- CHANGE START: Update Zod Schema ---
  const schema = z.object({
    seasonTeamPlayerId: z.string().nonempty("Pemain wajib diisi"),
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

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      seasonTeamPlayerId: "",
      performance: {
        teamLeaderboard: 0,
        goal: 0,
        assist: 0,
        save: 0,
      },
    },
  });
  // --- CHANGE END: Update Zod Schema ---

  const queryClient = useQueryClient();
  const createCandidate = useCreateCandidate();

  // --- CHANGE START: Update onSubmit Logic ---
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    // Payload sudah memiliki struktur yang benar dari form, tinggal tambahkan votingId
    const payload = {
      ...data,
      votingId: votingId,
    };

    createCandidate.mutate(
      { body: payload },
      {
        onSuccess: () => {
          // Reset form ke default values yang baru
          form.reset({
            seasonTeamPlayerId: "",
            performance: { goal: 0, assist: 0, save: 0 },
          });
          toast.success("Kandidat berhasil ditambahkan");
          setOpenModal(false);
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/candidates"],
          });
          setIsSubmitting(false);
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(
            error?.data?.message ||
              "Terjadi kesalahan saat menambahkan kandidat"
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
        },
      }
    );
  };
  // --- CHANGE END: Update onSubmit Logic ---

  const { data: season, isFetching: isFetchingSeason } = useGetActiveSeason();

  const seasonTeamPlayer = useGetPlayingPlayers({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
    seasonId: season?.data?.id ?? "none",
  });
  const seasonTeamPlayers = seasonTeamPlayer.data?.data?.list || [];

  const { data: votingData, isFetching } = useGetVotingById(votingId);
  const { data: candidateData } = useGetCandidates({ votingId: votingId });
  const totalItems = candidateData?.data?.total || 0;

  if (!votingId) {
    return <div>ID voting tidak ditemukan.</div>;
  }

  if (isFetching || isFetchingSeason) {
    return (
      <SuperadminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" />
          <p className="text-gray-500 ml-2">Memuat detail voting...</p>
        </div>
      </SuperadminLayout>
    );
  }

  const voting = votingData?.data;

  return (
    <SuperadminLayout>
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2">
            <Link href={"/sa/manage-voting"}>
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold"> Detail Voting </h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Judul</p>
            <p className="text-xl font-semibold">{voting?.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Series</p>
            <p className="text-xl font-semibold">{voting?.series.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Periode</p>
            <p className="text-xl font-semibold">
              {formatDate(voting?.startDate)} - {formatDate(voting?.endDate)}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4">
            <h1 className="text-lg font-semibold">Kandidat dan Hasil Voting</h1>
            <Button
              className="gap-2 text-white bg-blue-pfl"
              onClick={() => {
                form.reset();
                setOpenModal(true);
              }}
            >
              Tambah Kandidat
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {totalItems === 0 ? (
            <Card className="border x-overflow-auto shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
                <h3 className="text-xl font-semibold mb-2">
                  Belum Ada Data Kandidat
                </h3>
                <p className="text-muted-foreground text-center">
                  Silahkan Tambahkan Kandidat Baru Untuk di Vote
                </p>
              </CardContent>
            </Card>
          ) : (
            <CandidatesDataTable candidates={candidateData?.data?.list || []} />
          )}
        </CardContent>
      </Card>

      {/* --- CHANGE START: Update Modal Form --- */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Tambah Kandidat Baru
            </DialogTitle>
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
                  Tambahkan Kandidat
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/* --- CHANGE END: Update Modal Form --- */}
    </SuperadminLayout>
  );
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
