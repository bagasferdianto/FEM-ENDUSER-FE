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

export default function ManageCandidatePage() {
  const params = useParams();
  const votingId = params?.id as string;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    votingId: z.string().nonempty("Voting wajib dipilih"),
    seasonTeamPlayerId: z.string().nonempty("Pemain wajib diisi"),
    performance: z.string().nonempty("Posisi wajib diisi"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      votingId: votingId,
      seasonTeamPlayerId: "",
      performance: "",
    },
  });

  const queryClient = useQueryClient();
  const createCandidate = useCreateCandidate();

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    const payload = {
      votingId: votingId,
      seasonTeamPLayerId: data.seasonTeamPlayerId,
      performance: data.performance,
    };

    createCandidate.mutate(
      { body: payload },
      {
        onSuccess: () => {
          form.reset();
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
        },
      }
    );
  };

  const seasonTeamPlayer = useGetPlayingPlayers({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
  });
  const seasonTeamPlayers = seasonTeamPlayer.data?.data?.list || [];

  const { data: votingData, isFetching } = useGetVotingById(votingId);
  const [openModal, setOpenModal] = useState(false);

  const { data: candidateData } = useGetCandidates({ votingId: votingId });
  const totalItems = candidateData?.data?.total || 0;

  if (!votingId) {
    // Handle error
    return <div>ID voting tidak ditemukan.</div>;
  }

  if (isFetching) {
    return (
      <SuperadminLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat detail voting...</p>
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
          <div className="flex items-center justify-between">
            <h1 className="text-sm text-muted-foreground">
              Kandidat dan Hasil Voting
            </h1>
            <Button
              className="gap-2 text-white bg-blue-pfl"
              onClick={() => setOpenModal(true)}
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
            <div className="space-y-2 flex flex-col justify-center items-center">
              <CandidatesDataTable
                candidates={candidateData?.data?.list || []}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="w-full max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="sr-only">Tambahkan Kandidat</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <FormItem>
                    <RequiredLabel> Performa </RequiredLabel>
                    <FormControl>
                      <Input placeholder="Masukkan Performa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center mt-4">
                <Button
                  type="submit"
                  className="bg-blue-pfl flex items-center justify-center hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Tambahkan Kandidat
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
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
