'use client';

import { PurchaseResponse, StatusEnum } from "@/app/_models/response/purchase";
import { useGetPurchaseById } from "@/app/_services/purchase";
import RequireLoginDialog from "@/components/ui/require-login-dialog";
import { useSeason } from "@/contexts/season-context";
import { formatDate, formatRupiah } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface PaymentProps {
  onNext: (purchase: PurchaseResponse) => void;
  purchaseId: string;
}

const Payment = ({ onNext, purchaseId }: PaymentProps) => {
    const { data: purchase } = useGetPurchaseById(purchaseId);
    const activeSeason = useSeason();

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    const [showNeedLogin, setShowNeedLogin] = useState(false);

    useEffect(() => {
        if (Cookies.get("auth_token") === undefined) {
            setShowNeedLogin(true);
        }
        if ( purchase?.data?.status === StatusEnum.Paid) {
            onNext(purchase);
        }
    }, [purchase?.data?.status, purchase, onNext]);

    const handleOpenPaymentLink = () => {
        if (purchase?.data?.invoice?.invoiceUrl) {
            window.open(purchase.data.invoice.invoiceUrl, "_blank");
        }
    };

    return (
        
        <div className="w-full max-w-4xl space-y-4">
            <div className="bg-red-100 text-red-600 text-center py-2 rounded-md font-medium">
                Silakan selesaikan pembayaran Anda untuk mendapatkan e-tiket
            </div>
            <div className="border rounded-lg p-4">
                <h2 className="text-center text-white font-bold bg-blue-900 py-3 rounded-md mb-4">
                    Menunggu Pembayaran
                </h2>
                <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Nomor Faktur</span>
                        <span>{purchase?.data?.invoice.invoiceExternalId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tanggal Pemesanan</span>
                        <span>{!purchase?.data?.createdAt ? "-" : formatDate(purchase?.data?.createdAt) }</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between">
                        <div className="flex gap-2">
                            <span>Tiket Pertandingan { purchase?.data?.isCheckoutPackage ? purchase.data.series.name : purchase?.data?.tickets[0].name }</span>
                            <span className="text-blue-pfl">( {purchase?.data?.amount}x {formatRupiah(purchase?.data?.price ?? 0)} )</span>
                        </div>
                        <span>{formatRupiah(purchase?.data?.grandTotal ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Biaya Admin</span>
                        <span>Rp 0</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                        <span>Harga Total</span>
                        <span className="text-blue-900">{ formatRupiah(purchase?.data?.grandTotal ?? 0) }</span>
                    </div>
                </div>
            </div>
            <button
                className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800"
                onClick={handleOpenPaymentLink}
            >
                Buka Link Pembayaran
            </button>

            <RequireLoginDialog
                onOpenChange={setShowNeedLogin}
                open={showNeedLogin}
                seasonLogo={activeSeason?.logo.url}
                callbackUrl={currentUrl}
                message="Untuk melanjutkan pembelian, silakan login terlebih dahulu."
            />
        </div>
    )
};

export default Payment;
