"use client"

import { use, useEffect, useState } from 'react';
import MemberLayout from '@/components/layout-member';
import Transaction from '@/app/purchase/_components/transaction';
import Payment from '@/app/purchase/_components/payment';
import Invoice from '@/app/purchase/_components/invoice';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useGetSeriesById } from '@/app/_services/series';
import LoadingCard from '@/components/ui/loading';
import { PurchaseResponse } from '@/app/_models/response/purchase';

interface PurchasePageProps {
  params: Promise<{
    productId: string;
  }>;
}

const PurchasePage = ({ params } : PurchasePageProps) => {
    const { productId } = use(params);
    const searchParams = useSearchParams()
    const purchaseIdParam = searchParams.get("purchaseId");
    const { data: series, isFetching } = useGetSeriesById(productId);
    
    const [step, setStep] = useState<'data' | 'confirm' | 'success'>('data');
    const [purchaseId, setPurchaseId] = useState<string | null>(null);
    const [purchase, setPurchase] = useState<PurchaseResponse | null>(null);
    const router = useRouter();

    useEffect(() => {
        if(purchaseIdParam) {
            setPurchaseId(purchaseIdParam);
            setStep("confirm")
        }
    }, [purchaseIdParam]);

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

    const handleTransactionSuccess = (purchaseId: string) => {
        setPurchaseId(purchaseId)
        updateURL(purchaseId)
        setStep("confirm")
    }

    const handlePaymentSuccess = (purchase: PurchaseResponse) => {
        setPurchase(purchase)
        updateURL(purchase.data?.id)
        setStep("success")
    }

    const updateURL = (purchaseId?: string) => {
        const params = new URLSearchParams()
        if (purchaseId) {
            params.set("purchaseId", purchaseId)
        }

        // Only add search params if we're not on the initial transaction step
        const newURL =
        !purchaseId ? `/purchase/series/${productId}` : `/purchase/series/${productId}?${params.toString()}`

        router.replace(newURL)
    }

    if (isFetching) {
        <MemberLayout withFooter>
            <LoadingCard loadingMessage='Memuat data series' />
        </MemberLayout>
    }

    return (
        <MemberLayout withFooter>
            <div className="min-h-screen bg-white px-4 py-28 flex flex-col items-center">
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

                {step === 'data' && <Transaction onNext={handleTransactionSuccess} isPackage={true} series={series?.data} />}
                {step === 'confirm' && <Payment onNext={handlePaymentSuccess} purchaseId={purchaseId ?? ""} />}
                {step === 'success' && <Invoice onDone={() => router.push('/')} purchase={purchase} />}
            </div>
        </MemberLayout>
    )
}

export default PurchasePage;