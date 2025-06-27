import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Purchase, StatusEnum } from "../../_models/response/purchase";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

interface PurchasesDataTableProps {
  purchases: Purchase[];
}

export function PurchasesDataTable({ purchases }: PurchasesDataTableProps) {
  return (
    <div className="rounded-xl border overflow-x-auto">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow className="h-11">
            <TableHead className="w-1/5 text-muted-foreground">
              Invoice
            </TableHead>
            <TableHead className="w-1/5 text-muted-foreground">
              Jenis Tiket
            </TableHead>
            <TableHead className="w-1/4 text-muted-foreground">
              Tanggal Pembelian
            </TableHead>
            <TableHead className="w-1/3 text-muted-foreground">Email</TableHead>
            <TableHead className="w-1/5 text-muted-foreground">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase.id} className="h-11">
              <TableCell className="truncate max-w-xs font-medium">
                {purchase.invoice.invoiceExternalId}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {purchase.isCheckoutPackage ? "Series" : "1 Day"}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {purchase.paidAt === null ? "-" : formatDate(purchase.paidAt, {includeTime: true})}
              </TableCell>
              <TableCell className="truncate max-w-xs font-medium">
                {purchase.member.email}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
