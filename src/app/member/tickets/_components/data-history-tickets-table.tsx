"use client";

import { useGetTicketPurchases } from "@/app/_services/ticket-purchase";
import { PaginationControls } from "@/components/pagination/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyCard from "@/components/ui/empty-card";
import LoadingCard from "@/components/ui/loading";
import TicketModal from "@/components/ui/qr-ticket";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSeason } from "@/contexts/season-context";
import { cn, formatDate } from "@/lib/utils";
import { useState } from "react";

const Tickets = () => {
  const activeSeason = useSeason();
  const [page, setPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: ticketPurchases, isFetching } = useGetTicketPurchases({
    page: page.toString(),
  });

  const ticketPurchaseList = ticketPurchases?.data?.list || [];
  const totalItems = ticketPurchases?.data?.total || 0;
  const itemsPerPage = ticketPurchases?.data?.limit || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 h-full">
      <div className="flex justify-center items-start bg-white border rounded-lg shadow p-4">
        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data tiket anda..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            emptyTitle="Belum Ada Data Tiket"
            emptyMessage="Silahkan membeli tiket yang sudah disediakan"
          />
        ) : (
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 text-muted-foreground">
                  E-TIKET
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  TANGGAL PERTANDINGAN
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  VENUE
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  STATUS PENGGUNAAN
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketPurchaseList.map((ticketPurchase) => (
                <TableRow key={ticketPurchase.id}>
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    <Button
                      className="w-fit bg-blue-pfl text-white font-medium"
                      onClick={() => setSelectedTicketId(ticketPurchase.id)}
                    >
                      Lihat Detail
                    </Button>
                    <TicketModal
                      open={!!selectedTicketId && selectedTicketId === ticketPurchase.id}
                      onClose={() => setSelectedTicketId(null)}
                      qrValue={ticketPurchase.code}
                      ticketDate={formatDate(ticketPurchase.ticket.date)}
                      used={ticketPurchase.isUsed}
                      venue={ticketPurchase.venue.name}
                      logoUrl={activeSeason?.logo.url}
                    />
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    {formatDate(ticketPurchase.ticket.date)}
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    {ticketPurchase.venue.name}
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium">
                    <Badge
                      className={cn(
                        ticketPurchase.isUsed
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-500 hover:bg-green-600",
                        "rounded-full text-white"
                      )}
                    >
                      {ticketPurchase.isUsed
                        ? "Sudah digunakan"
                        : "Belum digunakan"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {totalItems !== 0 && (
        <div className="flex justify-end items-center w-full">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Tickets;
