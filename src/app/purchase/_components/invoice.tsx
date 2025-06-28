'use client';

const Invoice = ({ onDone }: { onDone: () => void }) => (
    <div className="w-full max-w-4xl space-y-4">
        <div className="bg-green-100 text-green-700 text-center py-2 rounded-md font-medium">
            e-tiket telah dikirimkan ke email <strong>marselino11@gmail.com</strong>
        </div>
        <div className="border rounded-lg p-4">
            <h2 className="text-center text-white font-bold bg-blue-900 py-3 rounded-md mb-4">
                Pembayaran Berhasil
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
                    <span>Bank Pembayaran</span>
                    <span>Mandiri</span>
                </div>
                <div className="flex justify-between">
                    <span>Atasnama e-wallet</span>
                    <span>Marselino Ferdinan</span>
                </div>
                <div className="flex justify-between">
                    <span>Nomor e-wallet</span>
                    <span>12345634245</span>
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
            onClick={onDone}
        >
            Selesai
        </button>
    </div>
);

export default Invoice;
