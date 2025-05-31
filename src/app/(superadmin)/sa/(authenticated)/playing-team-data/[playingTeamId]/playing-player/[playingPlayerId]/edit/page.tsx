"use client";

import { use, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SuperadminLayout from "@/components/layout-superadmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, SquareArrowLeft } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { FileUpload, Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetPlayingTeamById } from "@/app/(superadmin)/sa/(authenticated)/_services/playing-team";
import { PlayingTeam } from "@/app/(superadmin)/sa/(authenticated)/_models/response/playing-team";
import { useGetPlayers } from "@/app/(superadmin)/sa/(authenticated)/_services/player";
import {
  useGetPlayerPositions,
  useGetPlayingPlayerById,
  useUpdatePlayingPlayer,
} from "@/app/(superadmin)/sa/(authenticated)/_services/playing-player";

const schema = z.object({
  playerId: z.string().nonempty("Pemain wajib diisi"),
  position: z.string().nonempty("Posisi wajib diisi"),
  seasonTeamId: z.string().nonempty("Tim wajib dipilih"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
});

type FormData = z.infer<typeof schema>;

interface PlayingPlayerPageProps {
  params: Promise<{
    playingTeamId: string;
    playingPlayerId: string;
  }>;
}

export default function UpdatePlayingPlayerForm({
  params,
}: PlayingPlayerPageProps) {
  const { playingTeamId, playingPlayerId } = use(params);
  const { data: playingTeamData, isFetching: isFetchingPlayingTeam } =
    useGetPlayingTeamById(playingTeamId);

  const { data: playingPlayerData, isFetching: isFetchingPlayingPlayer } =
    useGetPlayingPlayerById(playingPlayerId);

  const [playingTeam, setPlayingTeam] = useState<PlayingTeam | null>(null);

  // get players for dropdown
  const [search, setSearch] = useState("");
  const debounceSearch = useDebounce(search, 500);
  const players = useGetPlayers({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
    search: debounceSearch,
  });
  const playersList = players.data?.data?.list || [];

  // get player positions for dropdown
  const { data: positionsData } = useGetPlayerPositions({});
  const positions = positionsData?.data || [];

  // handle create
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updatePlayingPlayer = useUpdatePlayingPlayer();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      playerId: "",
      position: "",
      seasonTeamId: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (!isFetchingPlayingTeam) {
      setPlayingTeam(playingTeamData?.data || null);
    }
    if (!playingPlayerData?.data) return;
    form.reset({
      playerId: playingPlayerData.data.player.id,
      position: playingPlayerData.data.position,
      seasonTeamId: playingPlayerData.data.seasonTeam.id,
      image: playingPlayerData.data.image.name,
    });
  }, [
    isFetchingPlayingTeam,
    isFetchingPlayingPlayer,
    playingTeamData,
    form,
    playingTeamId,
    playingPlayerData,
  ]);

  if (isFetchingPlayingPlayer && !playingPlayerData && playersList.length === 0 && positions.length === 0) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data pemain...</p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("playerId", data.playerId);
    formData.append("position", data.position);
    formData.append("seasonTeamId", data.seasonTeamId);
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    updatePlayingPlayer.mutate(
      {
        vars: { id: playingPlayerId },
        body: formData,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Pemain berhasil diperbarui");
          form.reset();
          router.push(`/sa/playing-team-data/${playingTeamId}/playing-player`);
        },
        onError: (error) => {
          setIsSubmitting(false);
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan pemain"
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

  return (
    <SuperadminLayout>
      <Card className="border-none p-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center space-x-2">
            <Link
              href={
                "/sa/playing-team-data/" + playingTeamId + "/playing-player"
              }
            >
              <SquareArrowLeft strokeWidth={1} />
            </Link>
            <h3 className="text-2xl font-bold">
              Perbarui Player di {playingTeam?.team.name}
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="playerId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <RequiredLabel>Player</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full" disabled>
                          <SelectValue placeholder="Pilih Player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto w-full">
                        <div className="px-2 py-1">
                          <Input
                            placeholder="Cari player..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="w-full"
                          />
                        </div>
                        {playersList.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
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
                name="position"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <RequiredLabel>Pilih Posisi Player</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Posisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto w-full">
                        {positions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
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
                name="image"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FileUpload
                      label="Masukkan Foto Player"
                      required
                      accept="image/*"
                      selectedFile={value ?? null}
                      onFileSelect={onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="bg-blue-pfl hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Perbarui Player
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
