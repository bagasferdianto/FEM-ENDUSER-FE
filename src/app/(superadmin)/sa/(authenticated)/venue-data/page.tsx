"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { VenuesDataTable } from "./_components/data-table";
import { PaginationControls } from "@/components/pagination/page";
import { useQueryClient } from "react-ohttp";
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
import { useCreateVenue, useGetVenues } from "../_services/venue";
import LoadingCard from "@/components/ui/loading";
import EmptyCard from "@/components/ui/empty-card";

export default function ManageVenuePage() {
  // search
  const [search, setSearch] = useState("");
  const hasActiveSearch = search.trim().length > 0;

  // pagination
  const [page, setPage] = useState(1);

  const { data: venues, isFetching } = useGetVenues({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
    search: search,
  });

  const venuesList = venues?.data?.list || [];
  const totalItems = venues?.data?.total || 0;
  const itemsPerPage = venues?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

  const createVenue = useCreateVenue();

  const schema = z.object({
    name: z.string().nonempty("Nama venue wajib diisi"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    createVenue.mutate(
      {
        body: data,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          setOpenModal(false);
          toast.success("Venue berhasil ditambahkan");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/venues"],
          });
        },
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan venue"
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
          <h1 className="text-2xl font-bold">Daftar Venue/Tempat</h1>

          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Cari Venue berdasarkan nama venue"
              onSearch={handleSearch}
              onPageReset={handlePageReset}
            />
            <Button
              className="gap-2 text-white bg-blue-pfl"
              onClick={() => setOpenModal(true)}
            >
              Tambah Data Venue
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data venue..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            searchActive={hasActiveSearch}
            searchText={search}
            emptyTitle="Belum Ada Data Venue/Tempat"
            emptyMessage="Silahkan Tambahkan Data Venue/Tempat"
          />
        ) : (
          <div className="space-y-2 flex flex-col justify-center items-center">
            <VenuesDataTable venues={venuesList} />

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="flex flex-col items-center justify-center">
          <DialogHeader>
            <DialogTitle className="sr-only">Tambahkan Venue</DialogTitle>
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
                    <FormLabel>Masukkan Nama Venue/Tempat</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nama Venue" />
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
                Tambahkan Venue
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}
