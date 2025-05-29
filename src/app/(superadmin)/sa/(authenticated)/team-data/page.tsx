"use client";

import SuperadminLayout from "@/components/layout-superadmin";
import { Button } from "@/components/ui/button";
import { useCreateTeam, useGetTeams } from "../_services/team";
import { Loader2, PackageOpen, Plus } from "lucide-react";
import TeamCard from "@/components/ui/team-card";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { PaginationControls } from "@/components/pagination/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload, Input } from "@/components/ui/input";
import { useQueryClient } from "react-ohttp";

export default function TeamDataPage() {
  // pagination
  const [page, setPage] = useState(1);
  const teams = useGetTeams({
    page: page.toString(),
    sort: "createdAt",
    dir: "desc",
  });

  const teamsList = teams.data?.data?.list || [];
  const totalItems = teams.data?.data?.total || 0;
  const itemsPerPage = teams.data?.data?.limit || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // handle dialog create
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const createTeam = useCreateTeam();

  const schema = z.object({
    name: z.string().nonempty("Nama season wajib diisi"),
    logo: z.instanceof(File, { message: "Logo season wajib dipilih" }),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      logo: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("logo", data.logo);

    createTeam.mutate(
      {
        body: formData,
      },
      {
        onError: (error) => {
          toast.error(
            error?.data?.message || "Terjadi kesalahan saat menambahkan team"
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
          toast.success("Team berhasil ditambahkan");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/teams"],
          });
          setOpenModal(false);
        },
      }
    );
  };

  return (
    <SuperadminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Tim</h1>
          </div>

          <Button
            className="gap-2 text-white bg-blue-pfl"
            onClick={() => {
              form.reset();
              setOpenModal(true);
            }}
          >
            Tambah Data Team
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Teams Grid */}
        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Team
              </h3>
              <p className="text-muted-foreground text-center">
                Silahkan Tambahkan Data Team Baru
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-6">
              {teamsList.map((team) => (
                <TeamCard key={team.id} team={team} actionButton />
              ))}
            </div>
            <div className="flex items-start justify-end">
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
            <DialogTitle className="sr-only">Tambahkan Tim</DialogTitle>
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
                    <FormLabel>Masukkan Nama Tim</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nama Tim" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FileUpload
                        label="Logo Team"
                        accept="image/*"
                        selectedFile={value}
                        onFileSelect={onChange}
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
                Tambahkan Team
                <Plus className="w-4 h-4" />
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}
