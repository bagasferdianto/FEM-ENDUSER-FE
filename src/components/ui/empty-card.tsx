import { PackageOpen, PackageX } from "lucide-react";
import { Card, CardContent } from "./card";

interface EmptyCardProps {
  searchActive?: boolean;
  searchText?: string;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function EmptyCard({
  searchActive = false,
  searchText = "Data",
  emptyTitle = "Belum Ada Data",
  emptyMessage = "Silahkan tambahkan data baru untuk membuat konten",
}: EmptyCardProps) {
  if (searchActive) {
    return (
      <Card className="border-none shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <PackageX className="w-16 h-16 mb-4" strokeWidth={0.5} />
          <h3 className="text-xl font-semibold mb-2">
            Tidak ada hasil yang ditemukan
          </h3>
          <p className="text-muted-foreground text-center">
            Tidak ada data yang cocok dengan pencarian &quot;{searchText}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
        <h3 className="text-xl font-semibold mb-2">{emptyTitle}</h3>
        <p className="text-muted-foreground text-center">{emptyMessage}</p>
      </CardContent>
    </Card>
  );
}
