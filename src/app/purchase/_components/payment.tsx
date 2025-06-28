'use client';

const Payment = ({ onNext }: { onNext: () => void }) => (
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
                    <span>pfl-10162-7607</span>
                </div>
                <div className="flex justify-between">
                    <span>Tanggal Pemesanan</span>
                    <span>1 Mei 2025</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between">
                    <span>Tiket Pertandingan Day 2</span>
                    <span>Rp25.000,00</span>
                </div>
                <div className="flex justify-between">
                    <span>Biaya Admin</span>
                    <span>Rp2.500,00</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                    <span>Harga Total</span>
                    <span className="text-blue-900">Rp27.500,00</span>
                </div>
            </div>
        </div>
        <button
            className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800"
            onClick={onNext}
        >
            Buka Link Pembayaran
        </button>
    </div>
);

export default Payment;
