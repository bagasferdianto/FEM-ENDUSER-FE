"use client";

import { StatusEnum } from "@/app/_models/response/purchase";
import { useGetPurchases } from "@/app/_services/purchase";
import { PaginationControls } from "@/components/pagination/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyCard from "@/components/ui/empty-card";
import LoadingCard from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatDate, formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const History = () => {
  const [page, setPage] = useState(1);

  const { data: purchases, isFetching } = useGetPurchases({
    page: page.toString(),
  });

  const purchaseList = purchases?.data?.list || [];
  const totalItems = purchases?.data?.total || 0;
  const itemsPerPage = purchases?.data?.limit || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 h-full">
      <div className="flex justify-center items-start bg-white border rounded-lg shadow p-4">
        {isFetching ? (
          <LoadingCard loadingMessage="Sedang memuat data transaksi..." />
        ) : totalItems === 0 ? (
          <EmptyCard
            emptyTitle="Belum Ada Data Pembelian Tiket"
            emptyMessage="Silahkan lakukan transaksi"
          />
        ) : (
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4 text-muted-foreground">
                  TANGGAL TRANSAKSI
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  TOTAL PEMBAYARAN
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  STATUS PENGGUNAAN
                </TableHead>
                <TableHead className="w-1/4 text-muted-foreground">
                  AKSI
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseList.map((purchase) => (
                <TableRow key={purchase.id} className="h-12">
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    {formatDate(purchase.createdAt)}
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    {formatRupiah(purchase.grandTotal)}
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium">
                    <Badge
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
                    </Badge>
                  </TableCell>
                  <TableCell className="truncate max-w-xs font-medium text-left w-1/4">
                    {purchase.status === StatusEnum.Pending ? (
                      <Link href={purchase.invoice.invoiceUrl}>
                        <Button className="w-fit bg-blue-pfl text-white font-medium">
                          Bayar Sekarang
                        </Button>
                      </Link>
                    ) : (
                      <span className="font-bold">--</span>
                    )}
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

export default History;
