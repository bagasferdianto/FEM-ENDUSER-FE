import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { XCircle } from "lucide-react";

interface FailedVoteProps {
  open: boolean;
  onClose: () => void;
}

const FailedVote: React.FC<FailedVoteProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center gap-4 px-24 py-8 rounded-2xl shadow-xl w-fit mx-auto text-center">
        
        <XCircle className="w-32 h-32 text-red-600 mb-2" />

        <DialogHeader className="flex flex-col justify-center items-center gap-4">
          <DialogTitle className="text-2xl text-red-600 font-bold">
            Voting Gagal!
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-700 text-center">
            Silakan lakukan voting ulang
          </DialogDescription>
        </DialogHeader>
        
      </DialogContent>
    </Dialog>
  );
};

export default FailedVote;
