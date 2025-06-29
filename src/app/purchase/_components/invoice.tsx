'use client';

import { PurchaseResponse } from "@/app/_models/response/purchase";
import { formatDate, formatRupiah } from "@/lib/utils";

interface InvoiceProps {
  onDone: () => void;
  purchase: PurchaseResponse | null;
}

const Invoice = ({ onDone, purchase }: InvoiceProps) => {
    return(
        <div className="w-full max-w-4xl space-y-4">
            <div className="bg-green-100 text-green-700 text-center py-2 rounded-md font-medium">
                e-tiket telah dikirimkan ke email <strong>{ purchase?.data?.member.email }</strong>
            </div>
            <div className="border rounded-lg p-4">
                <h2 className="text-center text-white font-bold bg-blue-900 py-3 rounded-md mb-4">
                    Pembayaran Berhasil
                </h2>
                <div className="text-sm space-y-4">
                    <p className="font-bold">Detail Pemesanan</p>
                    <div className="flex justify-between">
                        <span>Nomor Faktur</span>
                        <span>{ purchase?.data?.invoice.invoiceExternalId }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tanggal Pemesanan</span>
                        <span>{ !purchase?.data?.createdAt ? "-" : formatDate(purchase?.data?.createdAt) }</span>
                    </div>
                    <hr className="my-2" />
                    <p className="font-bold">Detail Pembayaran</p>
                    <div className="flex justify-between">
                        <span>Bank Pembayaran</span>
                        <span>{ purchase?.data?.invoice.paymentChannel }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Atasnama e-wallet</span>
                        <span>{ purchase?.data?.invoice.merchantName }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Nomor e-wallet</span>
                        <span>{ purchase?.data?.invoice.paymentDestination === "" ? "-" : purchase?.data?.invoice.paymentDestination }</span>
                    </div>
                    <hr className="my-2" />
                    <p className="font-bold">Detail Pembelian</p>
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
                onClick={onDone}
            >
                Selesai
            </button>
        </div>
    );
};

export default Invoice;
