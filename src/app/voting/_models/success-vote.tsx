import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

interface FailedVoteProps {
  open: boolean;
  onClose: () => void;
}

const SuccessVote: React.FC<FailedVoteProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex flex-col items-center gap-4 px-24 py-12 rounded-2xl shadow-xl w-fit mx-auto text-center">
        
        <CheckCircle className="w-32 h-32 text-blue-pfl" />

        <DialogHeader className="flex flex-col justify-center items-center gap-4">
          <DialogTitle className="text-2xl text-blue-pfl font-bold">
            Voting Berhasil
          </DialogTitle>
        </DialogHeader>
        
      </DialogContent>
    </Dialog>
  );
};

export default SuccessVote;
