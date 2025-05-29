import { Team } from "@/app/(superadmin)/sa/(authenticated)/_models/response/team";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Loader2 } from "lucide-react";
import ArrowRight from "@/app/assets/icon/arrow-right.svg";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDeleteTeam, useUpdateTeam } from "@/app/(superadmin)/sa/(authenticated)/_services/team";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { FileUpload, Input } from "./input";
import { Button } from "./button";
import { useQueryClient } from "react-ohttp";

interface TeamCardProps {
  team: Team;
  actionButton?: boolean;
  detailButton?: boolean;
  detailUrl?: string;
}

export default function TeamCard({
  team,
  actionButton = false,
  detailButton = false,
  detailUrl = "",
}: TeamCardProps) {
  // handle edit
  const [id, setId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const updateTeam = useUpdateTeam();
  const queryClient = useQueryClient();

  const schema = z.object({
    name: z.string().nonempty("Nama team wajib diisi"),
    logo: z.union([z.instanceof(File), z.string()]).optional(),
  });
  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      logo: undefined,
    },
  });

  const setUpdateForm = (data: Team) => {
    form.setValue("name", data.name);
    form.setValue("logo", data.logo.name);
    setId(data.id);
    setOpenModal(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", data.name);
    if (data.logo instanceof File) {
      formData.append("logo", data.logo);
    }

    updateTeam.mutate(
      {
        vars: { id: id },
        body: formData,
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
          toast.success("Team berhasil diperbarui");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/teams"],
          });
          setOpenModal(false);
        },
      }
    );
  };

  // handle delete
  const deleteTeam = useDeleteTeam();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const handleDeleteClick = (team: Team) => {
    setTeamToDelete(team);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (teamToDelete != null) {
      deleteTeam.mutate(
        {
          vars: { id: teamToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setTeamToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus season"
            );
          },
          onSuccess: () => {
            toast.success(`Team "${teamToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setTeamToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/teams"],
            });
          },
        }
      );
    }
  };

  return (
    <Card className="z-20 px-2 border-b-4 shadow-lg bg-club border-b-blue-pfl relative">
      <Image
        src={team?.logo?.url ?? ""}
        width={100}
        height={100}
        alt="LogoTeams"
        className="w-32 h-32 mx-auto object-contain"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild hidden={!actionButton}>
          <Ellipsis className="w-5 h-5 mx-auto mt-4 absolute top-0 right-3 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer font-medium"
              onClick={() => {
                setUpdateForm(team);
              }}
            >
              Edit Data Tim
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer font-medium"
              onClick={() => handleDeleteClick(team)}
            >
              Hapus Tim
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {detailButton ? (
        <Link
          href={detailUrl}
          className="cursor-pointer"
          hidden={!detailButton}
        >
          <div className="flex items-center mt-4 text-sm font-semibold justify-between h-10">
            <div className="text-sm text-center break-words">{team.name}</div>
            <Image src={ArrowRight} alt="ArrowRight" className="w-8 h-6" />
          </div>
        </Link>
      ) : (
        <div className="flex items-end mt-4 text-sm font-semibold justify-center h-10">
          <div className="text-sm text-center break-words">{team.name}</div>
        </div>
      )}

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
                        selectedFile={value ?? null}
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
                Perbarui Team
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Team Ini?
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
    </Card>
  );
}
