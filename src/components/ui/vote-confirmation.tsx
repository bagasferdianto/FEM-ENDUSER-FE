"use client";

import { X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { useHttpMutation, useQueryClient } from "@dhoniaridho/react-ohttp";
import { CandidateResponse } from "@/app/_models/response/candidate";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onSuccess: () => void;
  onError: () => void;
  seasonLogo: string;
  votingId: string;
  playerId: string;
  playerName: string;
  playerImage: string;
  teamLogo: string;
};

const VoteConfirmationDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  onError,
  seasonLogo,
  votingId,
  playerId,
  playerName,
  playerImage,
  teamLogo,
}) => {
  const queryClient = useQueryClient();
  const vote = useHttpMutation<FormData, CandidateResponse>(
    "/member/candidates/vote",
    {
      method: "POST",
      queryOptions: {
        onError: (error) => {
          onError();
          toast.error(error?.data?.message || "Terjadi kesalahan");
        },
        onSuccess: () => {
          onOpenChange(false);
          onSuccess();
          queryClient.invalidateQueries({
            queryKey: ["/member/candidates"],
          });
        },
      },
    }
  );

  const handleSubmit = () => {
    const payload = {
      votingId: votingId,
      candidateId: playerId,
    };

    vote.mutate({
      body: payload,
    });
  };

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
              <Image
                src={seasonLogo || "/images/PFL-Logo-Biru.png"}
                alt="PFL Logo"
                width={84}
                height={50}
              />
            </div>

            {/* Title */}
            <DialogTitle className="text-lg md:text-xl font-bold text-blue-pfl mb-4">
              Apakah kamu yakin memilih
              <br />
              {playerName}?
            </DialogTitle>

            {/* Player image */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
              <Image
                src={playerImage}
                alt={playerName}
                fill
                objectFit="cover"
                objectPosition="top"
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
            <div className="flex flex-row justify-between gap-4 mb-4 w-full">
              <DialogClose asChild className="flex-1">
                <Button className="bg-gray-100 text-blue-pfl border border-blue-pfl py-2 rounded-md hover:bg-gray-300">
                  Batal
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  onConfirm();
                  handleSubmit();
                  onOpenChange(false);
                }}
                className="flex-1 bg-blue-pfl text-white py-2 rounded-md hover:bg-blue-800"
              >
                Ya, Vote
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-600">
              <span className="text-blue-pfl font-medium">⚠ Perhatian.</span>{" "}
              Setelah voting, kamu tidak bisa mengganti pilihan.
            </p>
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default VoteConfirmationDialog;
