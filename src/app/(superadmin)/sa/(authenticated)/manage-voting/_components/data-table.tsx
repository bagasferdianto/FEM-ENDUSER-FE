"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import {
  type Voting,
  StatusEnum,
  StatusRequestEnum,
} from "../../_models/response/voting";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteVoting, useUpdateVoting } from "../../_services/voting";
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
import { formatDate } from "@/lib/utils";

interface VotingsDataTableProps {
  votings: Voting[];
}

export function VotingsDataTable({ votings }: VotingsDataTableProps) {
  const schema = z.object({
    status: z.nativeEnum(StatusRequestEnum),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [id, setId] = useState<string>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [votingToDelete, setVotingToDelete] = useState<Voting | null>(null);

  const updateStatus = useUpdateVoting();
  const deleteVoting = useDeleteVoting();
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
          toast.success("Status voting berhasil diubah");
          form.reset();
          router.push("/sa/manage-voting");
          queryClient.invalidateQueries({
            queryKey: ["/superadmin/votings"],
          });
        },
      }
    );
  });

  const handleDeleteClick = (voting: Voting) => {
    setVotingToDelete(voting);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (votingToDelete) {
      deleteVoting.mutate(
        {
          vars: { id: votingToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setVotingToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus voting"
            );
          },
          onSuccess: () => {
            toast.success(`Voting "${votingToDelete.title}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setVotingToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/votings"],
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
              Judul Voting
            </TableHead>
            <TableHead className="w-[10%] text-muted-foreground">
              Series
            </TableHead>
            <TableHead className="w-[20%] text-muted-foreground">
              Periode
            </TableHead>
            <TableHead className="w-[20%] text-muted-foreground">
              File Background
            </TableHead>
            <TableHead className="w-[5%] text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[10%] text-muted-foreground text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {votings.map((voting) => (
            <TableRow key={voting.id}>
              <TableCell className="truncate max-w-xs font-medium">
                {voting.title}
              </TableCell>
              <TableCell className="truncate max-w-xs">
                {voting.series?.name ?? "-"}
              </TableCell>
              <TableCell className="truncate max-w-xs">
                {formatDate(voting.startDate)} – {formatDate(voting.endDate)}
              </TableCell>
              <TableCell className="truncate max-w-xs">
                <a
                  href={voting.banner.url}
                  className="text-blue-600 hover:underline whitespace-nowrap"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {voting.banner.name}
                </a>
              </TableCell>
              <TableCell>
                <DropdownMenu onOpenChange={() => setId(voting.id)}>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className={cn(
                        voting.status === StatusEnum.Active
                          ? "bg-green-500 hover:bg-green-600"
                          : voting.status === StatusEnum.ComingSoon
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-red-500 hover:bg-red-600",
                        "rounded-full text-white cursor-pointer"
                      )}
                    >
                      {voting.status === StatusEnum.Active
                        ? "Active"
                        : voting.status === StatusEnum.ComingSoon
                        ? "Coming Soon"
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
                        form.setValue("status", StatusRequestEnum.ComingSoon);
                        onSubmit();
                      }}
                    >
                      <Badge className="bg-gray-500 hover:bg-gray-600 rounded-full text-white">
                        Coming Soon
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
                      <Badge className="bg-red-500 hover:bg-red-600 rounded-full text-white">
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
                      <Link href={`/sa/manage-voting/${voting.id}/edit`}>
                        Edit Voting
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="font-medium cursor-pointer"
                      onClick={() => handleDeleteClick(voting)}
                    >
                      Hapus Voting
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
              Apakah Anda yakin ingin menghapus voting ini?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-start gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteConfirm()}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
