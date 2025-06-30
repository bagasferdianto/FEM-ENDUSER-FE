import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { DialogTitle } from "@radix-ui/react-dialog";

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  qrValue: string;
  ticketDate: string;
  used: boolean;
  venue: string;
  logoUrl?: string | null;
}

const TicketModal: React.FC<TicketModalProps> = ({
  open,
  onClose,
  qrValue,
  ticketDate,
  used,
  venue,
  logoUrl,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center gap-4 p-6 rounded-2xl shadow-xl max-w-sm mx-auto w-fit px-24">
        <DialogTitle>
          <div className="flex justify-center mb-4">
            <Image
              src={logoUrl ?? "/images/pfl-logo-biru-horizontal.png"}
              alt="PFL Logo"
              width={84}
              height={50}
            />
          </div>
        </DialogTitle>
        <div className="text-2xl font-bold text-blue-pfl">Tiket 1 Day</div>

        <div className="shadow-lg rounded-xl p-2 bg-white">
          <QRCodeCanvas
            value={qrValue}
            size={160}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
          />
        </div>

        <div className="flex flex-row text-sm text-gray-700 text-center">
          {venue},&nbsp;<div className="font-semibold">{ticketDate}</div>
        </div>

        <div
          className={`text-sm font-medium ${
            used ? "text-red-500" : "text-blue-pfl"
          }`}
        >
          {used ? "Sudah Digunakan" : "Belum Digunakan"}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
