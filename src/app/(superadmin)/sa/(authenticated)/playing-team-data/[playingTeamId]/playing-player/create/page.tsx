"use client";

import { use, useEffect, useState } from "react";
import { z } from "zod";
import { useGetPlayingTeamById } from "../../../../_services/playing-team";
import { PlayingTeam } from "../../../../_models/response/playing-team";
import {
  useCreatePlayingPlayer,
  useGetPlayerPositions,
} from "../../../../_services/playing-player";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SuperadminLayout from "@/components/layout-superadmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2, Plus, SquareArrowLeft } from "lucide-react";
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
import { useGetPlayers } from "../../../../_services/player";
import { Button } from "@/components/ui/button";
import { FileUpload, SearchInput } from "@/components/ui/input";

const schema = z.object({
  playerId: z.string().nonempty("Pemain wajib diisi"),
  position: z.string().nonempty("Posisi wajib diisi"),
  seasonTeamId: z.string().nonempty("Tim wajib dipilih"),
  image: z.instanceof(File, { message: "Foto pemain wajib dipilih" }),
});

type FormData = z.infer<typeof schema>;

interface PlayingPlayerPageProps {
  params: Promise<{
    playingTeamId: string;
  }>;
}

export default function CreatePlayingPlayerForm({
  params,
}: PlayingPlayerPageProps) {
  const { playingTeamId } = use(params);
  const { data: playingTeamData, isFetching } =
    useGetPlayingTeamById(playingTeamId);

  const [playingTeam, setPlayingTeam] = useState<PlayingTeam | null>(null);

  // get players for dropdown
  const [search, setSearch] = useState("");
  const players = useGetPlayers({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
    search: search,
  });
  const playersList = players.data?.data?.list || [];

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  // get player positions for dropdown
  const { data: positionsData } = useGetPlayerPositions({});
  const positions = positionsData?.data || [];

  // handle create
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPlayingPlayer = useCreatePlayingPlayer();
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
    if (!isFetching) {
      setPlayingTeam(playingTeamData?.data || null);
      form.setValue("seasonTeamId", playingTeamId);
    }
  }, [isFetching, playingTeamData, form, playingTeamId]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("playerId", data.playerId);
    formData.append("position", data.position);
    formData.append("seasonTeamId", data.seasonTeamId);
    formData.append("image", data.image);

    createPlayingPlayer.mutate(
      {
        body: formData,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          toast.success("Pemain berhasil ditambahkan");
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
              Tambahkan Player Baru di {playingTeam?.team.name}
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
                    <RequiredLabel>Pilih Nama Player</RequiredLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Player" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto w-full">
                        <div className="px-2 py-1">
                          <SearchInput
                            placeholder="Cari player..."
                            onSearch={handleSearch}
                            className="w-full"
                          />
                        </div>
                        {playersList.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}{" "}
                            {player.stageName && `(${player.stageName})`}
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
                      selectedFile={value}
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
                Tambahkan Player
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </SuperadminLayout>
  );
}
