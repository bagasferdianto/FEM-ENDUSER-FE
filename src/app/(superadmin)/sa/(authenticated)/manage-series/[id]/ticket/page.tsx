"use client";
import { use, useEffect, useState } from "react";
import { useGetSeriesById } from "../../../_services/series";
import SuperadminLayout from "@/components/layout-superadmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CalendarDays,
  PackageOpen,
  Tag,
  Trash2,
} from "lucide-react";
import { formatDate, formatRupiah } from "@/lib/utils";
import { useDeleteTicket, useGetTickets } from "../../../_services/ticket";
import { Card, CardContent } from "@/components/ui/card";
import MatchCard from "./_components/match-card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket } from "../../../_models/response/ticket";
import { toast } from "sonner";
import { useQueryClient } from "react-ohttp";

interface TicketPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default function TicketPage({ params }: TicketPageProps) {
  const { id } = use(params);
  const { data: series, isFetching } = useGetSeriesById(id);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!series?.data) return;
    };

    fetchSeries();
  }, [series]);

  // paginate ticket
  const tickets = useGetTickets({
    sort: "createdAt",
    dir: "desc",
    limit: "1000",
    seriesId: series?.data?.id || "none",
  });
  const ticketsList = tickets.data?.data?.list || [];
  const totalItems = tickets.data?.data?.total || 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  const deleteTicket = useDeleteTicket();
  const queryClient = useQueryClient();

  const handleDeleteClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (ticketToDelete) {
      deleteTicket.mutate(
        {
          vars: { id: ticketToDelete.id },
        },
        {
          onError: (error) => {
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
            toast.error(
              error.data?.message || "Terjadi kesalahan saat menghapus ticket"
            );
          },
          onSuccess: () => {
            toast.success(`Ticket "${ticketToDelete.name}" berhasil dihapus`);
            setDeleteDialogOpen(false);
            setTicketToDelete(null);
            queryClient.invalidateQueries({
              queryKey: ["/superadmin/tickets"],
            });
          },
        }
      );
    }
  };

  if (isFetching) {
    return (
      <SuperadminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data series...</p>
          </div>
        </div>
      </SuperadminLayout>
    );
  }

  return (
    <SuperadminLayout>
      <div className="space-y-6 max-w-full">
        <div className="flex items-center justify-between">
          <div className="space-x-2 flex flex-row items-center">
            <h1 className="text-2xl font-bold">{series?.data?.name}</h1>
            <Tag className="h-4 w-4" strokeWidth={0.5} />
            <p className="text-gray-700">
              Harga Tiket Series : {formatRupiah(series?.data?.price || 0)}
            </p>
          </div>
          <Link href={`/sa/manage-series/${series?.data?.id}/manage-schedule`}>
            <Button className="gap-2 text-white bg-blue-pfl">
              Atur Jadwal Pertandingan
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {totalItems === 0 ? (
          <Card className="border-none shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
              <h3 className="text-xl font-semibold mb-2">
                Belum Ada Data Jadwal Pertandingan
              </h3>
              <p className="text-muted-foreground text-center">
                Silahkan Atur Jadwal Pertandingan
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {(ticketsList || []).map((ticket) => (
              <div key={ticket.id}>
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center justify-start space-x-2">
                    <h1 className="text-2xl font-bold">{ticket.name}</h1>
                    <Tag className="h-4 w-4" strokeWidth={0.5} />
                    <p className="text-gray-700">
                      Harga Tiket Series :{formatRupiah(ticket.price || 0)}
                    </p>
                    <CalendarDays className="h-4 w-4" strokeWidth={0.5} />
                    <p className="text-gray-700">{formatDate(ticket.date)}</p>
                  </div>
                  <Button className="text-white bg-red-600" onClick={() => handleDeleteClick(ticket)}>
                    <Trash2 className="h-4 w-4 text-white" />
                    Hapus Match Day
                  </Button>
                </div>
                <MatchCard matchs={ticket.matchs ?? []} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apakah Anda Yakin Untuk Menghapus Tiket Hari Ini?
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
    </SuperadminLayout>
  );
}
