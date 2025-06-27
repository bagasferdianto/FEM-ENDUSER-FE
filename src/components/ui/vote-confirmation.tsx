'use client';

import { X } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogClose, DialogContent,  DialogOverlay,  DialogPortal,  DialogTitle } from "./dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  playerName: string;
  playerImage: string;
  teamLogo: string;
};

const VoteConfirmationDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onConfirm,
  playerName,
  playerImage,
  teamLogo,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogContent className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl text-center">
            {/* Close button */}
            <DialogClose asChild>
              <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                <X />
              </button>
            </DialogClose>

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <Image src="/images/PFL-Logo-Biru.png" alt="PFL Logo" width={84} height={50} />
            </div>

            {/* Title */}
            <DialogTitle className="text-lg md:text-xl font-bold text-blue-pfl mb-4">
              Apakah kamu yakin memilih<br />{playerName}?
            </DialogTitle>

            {/* Player image */}
            <div className="relative w-full h-56 rounded-lg overflow-hidden mb-4">
              <Image
                src={playerImage}
                alt={playerName}
                layout="fill"
                objectFit="cover"
              />
              <Image
                src={teamLogo}
                alt="Team Logo"
                width={40}
                height={40}
                className="absolute top-2 left-2"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 mb-4">
              <DialogClose asChild>
                <button className="w-1/2 bg-blue-pfl text-white py-2 rounded-md hover:bg-blue-900">
                  Batal
                </button>
              </DialogClose>
              <button
                onClick={() => {
                  onConfirm();
                  onOpenChange(false);
                }}
                className="w-1/2 bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900"
              >
                Ya, Vote
              </button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-600">
              <span className="text-blue-pfl font-medium">⚠ Perhatian.</span> Setelah voting, kamu tidak bisa mengganti pilihan.
            </p>
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default VoteConfirmationDialog;
