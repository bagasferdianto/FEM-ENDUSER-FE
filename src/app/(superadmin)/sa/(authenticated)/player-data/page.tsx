"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useCreatePlayer, useGetPlayers } from "../_services/player";
import { PlayersDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import { useQueryClient } from "@dhoniaridho/react-ohttp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
} from "@/components/ui/form";
import { Input, SearchInput } from "@/components/ui/input";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";

export default function ManagePlayerPage() {
  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  // pagination
  const [page, setPage] = useState(1);

  const { data: players, isFetching } = useGetPlayers({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    search: search,
  });

  const playersList = players?.data?.list || [];
  const totalItems = players?.data?.total || 0;
  const itemsPerPage = players?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // handle search
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };
  const handlePageReset = () => {
    setPage(1);
  };

  // handle dialog create
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createPlayer = useCreatePlayer();

  const schema = z.object({
    name: z.string().nonempty("Nama player wajib diisi"),
    stageName: z.string().nullable().optional(),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      stageName: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    createPlayer.mutate(
      {
        body: data,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setOpenModal(false);
          toast.success("Player berhasil ditambahkan");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/players"],
          });
        },
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan player"
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
      }
    );
  };

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daftar Player</h1>
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Player berdasarkan nama/nama panggung"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
            <Button
              className="gap-2 text-white bg-blue-pfl"
              onClick={() => {
                setOpenModal(true);
                form.reset();
              }}
            >
              Tambah Data Player
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data player..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Player"
            emptyMessage="Silahkan Tambahkan Data Player Baru"
          />
        ) : (
          <div className="space-y-4">
            <PlayersDataTable players={playersList} />

            <div className="flex items-end justify-end">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="sr-only">Tambahkan Player</DialogTitle>
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
                    <FormLabel>Masukkan Nama Panggung (opsional)</FormLabel>
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
                Tambahkan Player
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}
