'use client';

import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Transaction = ({ onNext }: { onNext: () => void }) => {
    return (
        <div className="w-full max-w-4xl space-y-4">
            <div className="relative w-full h-[336px] rounded-lg overflow-hidden">
                <Image
                    src={"/images/payment-banner.webp"}
                    alt="Stadium Background"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="border rounded-lg p-4">
                <h2 className="text-blue-900 font-bold mb-2">Detail Pembelian</h2>
                <p className="font-semibold text-gray-800">Pertandingan Day 2</p>
                <p className="text-sm text-gray-500">04 Mei 2025</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="font-bold">Rp25.000,00</span>
                    <div className="flex items-center space-x-2">
                        <Button size="icon" className="w-6 h-6 bg-gray-200">
                            <Minus className="w-4 h-4 text-gray-700" />
                        </Button>
                        <span className="text-sm font-medium">1 TIKET</span>
                        <Button size="icon" className="w-6 h-6 bg-gray-200">
                            <Plus className="w-4 h-4 text-gray-700" />
                        </Button>
                    </div>
                </div>
            </div>
            <button
                className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800"
                onClick={onNext}
            >
                Lanjutkan ke Pembayaran
            </button>
        </div>
    )
};

export default Transaction;
