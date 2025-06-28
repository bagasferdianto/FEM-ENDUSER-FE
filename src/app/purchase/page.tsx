"use client"

import { useState } from 'react';
import MemberLayout from '@/components/layout-member';
import Transaction from '@/app/purchase/_components/transaction';
import Payment from '@/app/purchase/_components/payment';
import Invoice from '@/app/purchase/_components/invoice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PurchasePage = () => {
    const [step, setStep] = useState<'data' | 'confirm' | 'success'>('data');
    const router = useRouter();
    const stepIcons = [
        '/icons/book.svg',
        '/icons/check-circle-2.svg',
        '/icons/dollar-sign.svg',
    ];
    const steps = [
        {
            label: 'Data Transaksi',
            description: 'informasi pemesanan',
        },
        {
            label: 'Pembayaran',
            description: 'informasi pembayaran',
        },
        {
            label: 'Selesai',
            description: 'informasi transaksi',
        },
    ];

    // const handleToXendit = async () => {
    //     try {
    //         const res = await fetch('/api/create-xendit-invoice', {
    //             method: 'POST',
    //             body: JSON.stringify({ /* data transaksi */ }),
    //         });

    //         const result = await res.json();
    //         const { xendit_url } = result;

    //         if (xendit_url) {
    //             window.location.href = xendit_url; // Redirect langsung ke Xendit
    //         } else {
    //             alert('Gagal mendapatkan link pembayaran.');
    //         }
    //     } catch (error) {
    //         console.error('Redirect error:', error);
    //         alert('Terjadi kesalahan saat memproses pembayaran.');
    //     }
    // };

    return (
        <MemberLayout withFooter>
            <div className="min-h-screen bg-white px-4 py-8 flex flex-col items-center">
                <div className="flex items-center justify-between w-full max-w-4xl border rounded-lg p-8 mb-6">
                    {steps.map((stepItem, index) => {
                        const stepOrder = ['data', 'confirm', 'success'];
                        const currentIndex = stepOrder.indexOf(step);
                        const isActive = index === currentIndex;
                        const isCompleted = index < currentIndex;

                        return (
                            <div key={index} className="flex flex-row items-center flex-1">
                                {/* Step + Label */}
                                <div className="flex flex-row items-center space-x-3">
                                    <div
                                        className={`w-10 h-10 rounded-md flex items-center justify-center ${isActive
                                            ? 'bg-blue-900'
                                            : isCompleted
                                                ? 'bg-green-500'
                                                : 'bg-[#F5F5F5] border border-[#CECECE]'
                                            }`}
                                    >
                                        <Image
                                            src={stepIcons[index]}
                                            alt="Step icon"
                                            width={20}
                                            height={20}
                                            className={
                                                isActive || isCompleted ? 'invert brightness-0' : 'opacity-80'
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span
                                            className={`text-sm ${isActive ? 'text-blue-900 font-semibold' : 'text-gray-700 font-semibold'
                                                }`}
                                        >
                                            {stepItem.label}
                                        </span>
                                        <span
                                            className={`text-xs ${isActive ? 'text-blue-900' : 'text-gray-500'
                                                }`}
                                        >
                                            {stepItem.description}
                                        </span>
                                    </div>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-[1px] bg-gray-300 mx-4" />
                                )}
                            </div>
                        );
                    })}
                </div>

                {step === 'data' && <Transaction onNext={() => setStep('confirm')} />}
                {step === 'confirm' && <Payment onNext={() => setStep('success')} />}
                {/* {step === 'confirm' && <Payment onNext={handleToXendit} />} */}
                {step === 'success' && <Invoice onDone={() => router.push('/')} />}
            </div>
        </MemberLayout>
    )
}

export default PurchasePage;