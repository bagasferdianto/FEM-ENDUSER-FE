import { AlertTriangle, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
  DialogTitle,
} from "./dialog";
import Image from "next/image";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seasonLogo: string | undefined;
  callbackUrl: string;
  message?: string;
};

const RequireLoginDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  seasonLogo,
  callbackUrl,
  message = "Untuk melanjutkan, silakan login terlebih dahulu.",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
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

            <div className="mb-4">
              {/* Title */}
              <DialogTitle className="flex text-lg md:text-xl font-bold text-blue-pfl text-center justify-center items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-pfl" />
                Login Diperlukan
              </DialogTitle>

              {/* Description */}
              <p className="text-sm text-gray-600">{message}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-4 mb-4">
              <DialogClose asChild>
                <button className="w-1/2 bg-slate-700 text-white py-2 rounded-md hover:bg-slate-900">
                  Batal
                </button>
              </DialogClose>
              <Link
                href={"/login?callbackUrl=" + callbackUrl}
                className="w-1/2 bg-blue-pfl text-white py-2 rounded-md hover:bg-blue-800"
              >
                <button
                  onClick={() => {
                    onOpenChange(false);
                  }}
                >
                  Login
                </button>
              </Link>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-600">
              Belum memiliki akun?
              <Link href="/register">
                <span className="text-blue-pfl"> Registrasi disini</span>
              </Link>
            </p>
          </DialogContent>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default RequireLoginDialog;
