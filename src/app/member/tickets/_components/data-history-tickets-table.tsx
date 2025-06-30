"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TicketModal from "@/components/ui/qr-ticket";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const Tickets = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 h-full">
      <div className="flex justify-center items-start bg-white border rounded-lg shadow p-4">
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
            <TableRow>
              <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                <Button className="w-fit bg-blue-pfl text-white font-medium" onClick={() => setShowModal(true)}>
                  Lihat Detail
                </Button>
                <TicketModal
                  open={showModal}
                  onClose={() => setShowModal(false)}
                  qrValue="https://example.com/tiket/1234"
                  ticketDate="30 Juni 2025"
                  used={false}
                />
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                1 April 2025
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                Surakarta
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                <Badge
                  className=
                  "bg-gray-500 hover:bg-gray-600 rounded-full text-white"
                >
                  Terbayar
                </Badge>
                {/* <Badge
                  className={cn(
                    purchase.status === StatusEnum.Paid
                      ? "bg-green-500 hover:bg-green-600"
                      : purchase.status === StatusEnum.Pending
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-red-500 hover:bg-red-600",
                    "rounded-full text-white cursor-pointer"
                  )}
                >
                  {purchase.status === StatusEnum.Paid
                    ? "Terbayar"
                    : purchase.status === StatusEnum.Pending
                    ? "Pending"
                    : "Gagal"}
                </Badge> */}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Tickets;
