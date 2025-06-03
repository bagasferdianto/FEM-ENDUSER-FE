"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRupiah } from "@/lib/utils";
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
import { MoreVertical } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "react-ohttp";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
  Series,
  StatusEnum,
  StatusRequestEnum,
} from "../../_models/response/series";
import { useDeleteSeries, useUpdateSeries } from "../../_services/series";

interface SeriesDataTableProps {
  series: Series[];
}

export function SeriesDataTable({ series }: SeriesDataTableProps) {
  const schema = z.object({
    status: z.nativeEnum(StatusRequestEnum),
  });

  const form = useForm<z.infer<typeof schema>>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const [id, setId] = useState<string>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [seriesToDelete, setSeriesToDelete] = useState<Series | null>(null);

  const updateStatus = useUpdateSeries();
  const deleteSeries = useDeleteSeries();
  const router = useRouter();
  const queryClient = useQueryClient();

  const onSubmit = form.handleSubmit((data) => {
    updateStatus.mutate(
      {
        vars: { id: id as string },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message || "Terjadi kesalahan");
        },
        onSuccess: () => {
          toast.success("Status series berhasil diubah");
          form.reset();
          router.push("/sa/manage-series");
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/series"],
          });
        },
      }
    );
  });

  const handleDeleteClick = (series: Series) => {
    setSeriesToDelete(series);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (seriesToDelete) {
      deleteSeries.mutate(
        {
          vars: { id: seriesToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setSeriesToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus series"
            );
          },
          onSuccess: () => {
            toast.success(`Series "${seriesToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setSeriesToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/series"],
            });
          },
        }
      );
    }
  };

  return (
    <div className="rounded-xl border overflow-x-auto">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/4 text-muted-foreground">
              Nama Series
            </TableHead>
            <TableHead className="w-1/3 text-muted-foreground">
              Tempat Series
            </TableHead>
            <TableHead className="w-1/3 text-muted-foreground">
              Jumlah Pertandingan
            </TableHead>
            <TableHead className="w-1/3 text-muted-foreground">
              Harga Tiket
            </TableHead>
            <TableHead className="w-1/12 text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-1/12 text-muted-foreground text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {series.map((series) => (
            <TableRow key={series.id}>
              <TableCell className="truncate max-w-xs font-medium">
                {series.name}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {series.venue.name}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {series.matchCount}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {formatRupiah(series.price)}
              </TableCell>
              <TableCell>
                <DropdownMenu onOpenChange={() => setId(series.id)}>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className={cn(
                        series.status === StatusEnum.Active
                          ? "bg-green-500 hover:bg-green-600"
                          : series.status === StatusEnum.Draft
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-red-500 hover:bg-red-600",
                        "rounded-full text-white cursor-pointer"
                      )}
                    >
                      {series.status === StatusEnum.Active
                        ? "Active"
                        : series.status === StatusEnum.Draft
                        ? "Draft"
                        : "Non-Active"}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="flex justify-center"
                      onClick={() => {
                        form.setValue("status", StatusRequestEnum.Active);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-green-500 hover:bg-green-600 rounded-full text-white">
                        Active
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex justify-center"
                      onClick={() => {
                        form.setValue("status", StatusRequestEnum.Draft);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-gray-500 hover:bg-gray-600 rounded-full text-white">
                        Draft
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex justify-center"
                      onClick={() => {
                        form.setValue("status", StatusRequestEnum.NonActive);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-gray-500 hover:bg-gray-600 rounded-full text-white">
                        Non-Active
                      </Badge>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell className="text-right font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      asChild
                    >
                      <Link href={`/sa/manage-series/${series.id}/ticket`}>
                        Detail Series
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      asChild
                    >
                      <Link href={`/sa/manage-series/${series.id}/edit`}>
                        Edit Series
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() => handleDeleteClick(series)}
                    >
                      Delete Series
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Series Ini?
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
