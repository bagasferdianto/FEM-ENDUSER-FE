"use client";

import { use, useEffect, useState } from "react";
import { useGetSeriesById } from "../../../_services/series";
import SuperadminLayout from "@/components/layout-superadmin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CalendarDays,
  Gauge,
  Loader2,
  PackageOpen,
  PieChart,
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
import type { Ticket } from "../../../_models/response/ticket";
import { toast } from "sonner";
import { useQueryClient } from "@dhoniaridho/react-ohttp";
import TicketCardExport from "./_components/ticket-card-export";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface TicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function TicketPageDynamic({ params }: TicketPageProps) {
  const { id } = use(params);
  const { data: series, isFetching } = useGetSeriesById(id);

  useEffect(() => {
    const fetchSeries = async () => {
      if (!series?.data) return;
    };
    fetchSeries();
  }, [series]);

  // paginate ticket
  const { data: tickets, isFetching: isFetchingTickets } = useGetTickets({
    sort: "date",
    dir: "asc",
    limit: "1000",
    seriesId: series?.data?.id || "none",
  });

  const ticketsList = tickets?.data?.list || [];
  const totalItems = tickets?.data?.total || 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportComponent, setShowExportComponent] = useState(false);

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

  // preload all images
  const preloadImages = async (ticketsList: Ticket[]) => {
    const imagePromises: Promise<void>[] = [];

    ticketsList.forEach((ticket) => {
      if (ticket.matchs) {
        ticket.matchs.forEach((match) => {
          if (match.homeSeasonTeam?.team?.logo) {
            const promise = new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = match.homeSeasonTeam.team.logo;
            });
            imagePromises.push(promise);
          }

          if (match.awaySeasonTeam?.team?.logo) {
            const promise = new Promise<void>((resolve) => {
              const img = new Image();
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = match.awaySeasonTeam.team.logo;
            });
            imagePromises.push(promise);
          }
        });
      }
    });

    await Promise.all(imagePromises);
  };

  const handleExport = async () => {
    if (totalItems === 0) {
      toast.error("Tidak ada data untuk diexport");
      return;
    }

    setIsExporting(true);

    try {
      setShowExportComponent(true);

      await new Promise((resolve) => setTimeout(resolve, 100));

      await preloadImages(ticketsList);

      await new Promise((resolve) => setTimeout(resolve, 500));

      const exportElement = document.getElementById("export-container");
      if (!exportElement) {
        throw new Error("Export element not found");
      }

      const canvas = await html2canvas(exportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: exportElement.scrollWidth,
        height: exportElement.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("export-container");
          if (clonedElement) {
            clonedElement.style.position = "static";
            clonedElement.style.visibility = "visible";
            clonedElement.style.opacity = "1";
            clonedElement.style.transform = "none";
            clonedElement.style.width = "210mm";
            clonedElement.style.height = "auto";
            clonedElement.style.display = "block";
          }
        },
      });

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const a4Width = 210;
      const a4Height = 297;

      const ratio = Math.min(
        a4Width / (canvasWidth * 0.264583),
        a4Height / (canvasHeight * 0.264583)
      );

      const finalWidth = canvasWidth * 0.264583 * ratio;
      const finalHeight = canvasHeight * 0.264583 * ratio;

      const pdf = new jsPDF({
        orientation: finalWidth > finalHeight ? "landscape" : "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;

      const imgData = canvas.toDataURL("image/png", 1.0);

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);

      const fileName = `ticket-cards-${series?.data?.name || "export"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      toast.success("PDF berhasil diexport!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Gagal mengexport PDF");
    } finally {
      // Hide the export component
      setShowExportComponent(false);
      setIsExporting(false);
    }
  };

  if (isFetching || isFetchingTickets) {
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
          <div className="flex items-center justify-evenly gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || totalItems === 0}
              className="text-white"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunduh...
                </>
              ) : (
                "Export Ke PDF"
              )}
            </Button>
            <Link
              href={`/sa/manage-series/${series?.data?.id}/manage-schedule`}
            >
              <Button className="gap-2 text-white bg-blue-pfl">
                Atur Jadwal Pertandingan
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
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
                      Harga Tiket : {formatRupiah(ticket.price || 0)}
                    </p>
                    <Gauge className="h-4 w-4" strokeWidth={0.5} />
                    <p className="text-gray-700">
                      Kuota Tiket : {ticket.quota.stock}
                    </p>
                    <PieChart className="h-4 w-4" strokeWidth={0.5} />
                    <p className="text-gray-700">
                      Sisa Kuota Tiket : {ticket.quota.remaining}
                    </p>
                    <CalendarDays className="h-4 w-4" strokeWidth={0.5} />
                    <p className="text-gray-700">{formatDate(ticket.date)}</p>
                  </div>
                  <Button
                    className="text-white bg-red-600"
                    onClick={() => handleDeleteClick(ticket)}
                  >
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

      <div
        id="export-container"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "210mm",
          backgroundColor: "white",
          visibility: "hidden",
          opacity: 0,
          zIndex: -1,
          transform: "translateY(-9999px)",
          display: showExportComponent ? "block" : "none",
        }}
      >
        {showExportComponent && <TicketCardExport ticketsList={ticketsList} />}
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
