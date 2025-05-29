"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreVertical } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "react-ohttp";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { Venue } from "../../_models/response/venue";
import { useDeleteVenue, useUpdateVenue } from "../../_services/venue";

interface VenuesDataTableProps {
  venues: Venue[];
}

export function VenuesDataTable({ venues }: VenuesDataTableProps) {
  // handle update dialog
  const schema = z.object({
    name: z.string().nonempty("Nama venue wajib diisi"),
  });

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const updateVenue = useUpdateVenue();
  const queryClient = useQueryClient();
  const [id, setId] = useState<string>("");

  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setUpdateForm = (data: Venue) => {
    form.setValue("name", data.name);
    setId(data.id);
    setOpenModal(true);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    updateVenue.mutate(
      {
        vars: { id: id },
        body: data,
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
          toast.success("Venue berhasil diperbarui");
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/venues"],
          });
          setOpenModal(false);
        },
      }
    );
  };

  // handle delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);
  const deleteVenue = useDeleteVenue();
  const handleDeleteClick = (venue: Venue) => {
    setVenueToDelete(venue);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (venueToDelete) {
      deleteVenue.mutate(
        {
          vars: { id: venueToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setVenueToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus venue"
            );
          },
          onSuccess: () => {
            toast.success(`Venue "${venueToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setVenueToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/venues"],
            });
          },
        }
      );
    }
  };

  return (
    <div className="rounded-xl border overflow-x-auto w-3/4">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 text-muted-foreground">No</TableHead>
            <TableHead className="w-1/2 text-muted-foreground">Nama Venue/Tempat</TableHead>
            <TableHead className="w-1/2 text-muted-foreground">Dibuat Pada Tanggal</TableHead>
            <TableHead className="w-1/12 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue, index) => (
            <TableRow key={venue.id}>
              <TableCell className="truncate max-w-xs text-foreground font-medium">{index + 1}</TableCell>
              <TableCell className="truncate max-w-xs text-foreground font-medium">{venue.name}</TableCell>
              <TableCell className="truncate max-w-xs text-foreground font-medium">
                {formatDate(venue.createdAt)}
              </TableCell>
              <TableCell className="text-right text-foreground font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => setUpdateForm(venue)}
                    >
                      Edit Venue
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium"
                      onClick={() => handleDeleteClick(venue)}
                    >
                      Delete Venue
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
            <DialogTitle className="sr-only">Edit Venue</DialogTitle>
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
                Perbarui Venue
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Venue Ini?
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
    </div>
  );
}
