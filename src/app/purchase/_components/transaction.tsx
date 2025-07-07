'use client';

import Image from 'next/image';
import { Loader2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Series } from '@/app/_models/response/series';
import { Ticket } from '@/app/_models/response/ticket';
import { formatDate, formatRupiah } from '@/lib/utils';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PurchaseResponse } from '@/app/_models/response/purchase';
import { useHttpMutation } from '@dhoniaridho/react-ohttp';
import { toast } from 'sonner';
import { useState } from 'react';
import Cookies from "js-cookie";
import RequireLoginDialog from '@/components/ui/require-login-dialog';
import { useSeason } from '@/contexts/season-context';
import { usePathname } from 'next/navigation';

interface TransactionProps {
  onNext: (purchaseId: string) => void;
  isPackage?: boolean;
  series?: Series | null;
  ticket?: Ticket | null;
}

const purchaseSchema = z.object({
    amount: z.number().min(1, "Minimal pembelian adalah 1 tiket"),
});

type FormData = z.infer<typeof purchaseSchema>;

const Transaction = ({ onNext, isPackage = false, series, ticket }: TransactionProps) => {
    const activeSeason = useSeason();
    const pathName = usePathname();
    const [showNeedLogin, setShowNeedLogin] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(purchaseSchema),
        defaultValues: {
            amount: 1,
        },
    })

    const { watch, setValue, handleSubmit } = form
    const currentAmount = watch("amount")

    const purchase = useHttpMutation<FormData, PurchaseResponse>(
        "/member/purchases",
        {
          method: "POST",
          queryOptions: {
            onError: (error) => {
                if (error.status === 401) {
                    setShowNeedLogin(true);
                } else {
                    toast.error(error?.data?.message || "Terjadi kesalahan");
                }
            },
            onSuccess: (data) => {
                onNext(data.data?.id ?? "");
            }
          }
        }
    );

    const packagePurchase = useHttpMutation<FormData, PurchaseResponse>(
        "/member/purchases/packages",
        {
          method: "POST",
          queryOptions: {
            onError: (error) => {
                if (error.status === 401) {
                    setShowNeedLogin(true);
                } else {
                    toast.error(error?.data?.message || "Terjadi kesalahan");
                }
            },
            onSuccess: (data) => {
                onNext(data.data?.id ?? "");
            }
          }
        }
    );

    // handle amount increment
    const incrementAmount = () => {
        setValue("amount", currentAmount + 1)
    }

    // handle amount decrement
    const decrementAmount = () => {
        if (currentAmount > 1) {
        setValue("amount", currentAmount - 1)
        }
    }

    // handle form submit
    const handleFormSubmit = async (data: FormData) => {
        // if token is null, show need login dialog
        if (Cookies.get("auth_token") === undefined) {
            setShowNeedLogin(true);
            return;
        }

        const productId = isPackage ? series?.id : ticket?.id
        if (!productId) {
            toast.error("Produk ID tidak valid")
            return
        }

        const payload = {
            amount: data.amount,
            productId: productId,
        };

        if (isPackage) {
            packagePurchase.mutate(
                {body: payload,},
            )
        } else {
            purchase.mutate(
                {body: payload,},
            )
        }
    }

    const basePrice = isPackage ? series?.price || 0 : ticket?.price || 0
    const totalPrice = basePrice * currentAmount

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
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="border rounded-lg p-4">
                    <h2 className="text-blue-900 font-bold mb-2">Detail Pembelian</h2>
                    <p className="font-semibold text-gray-800">{isPackage ? series?.name : ticket?.name}</p>
                    <p className="text-sm text-gray-500">
                        {isPackage
                        ? ((series?.startDate && formatDate(series?.startDate)) + ' - ' + (series?.endDate && formatDate(series?.endDate))) : (ticket?.date && formatDate(ticket?.date))}</p>
                    <div className="flex justify-between items-center mt-4">
                        <div className="space-y-1">
                            <div className="text-sm text-gray-600">Harga per tiket: {formatRupiah(basePrice)}</div>
                            <div className="font-bold text-lg">Total: {formatRupiah(totalPrice)}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button 
                                type="button"
                                size="icon" 
                                className="w-6 h-6 bg-gray-200"
                                onClick={decrementAmount}
                                disabled={currentAmount <= 1}
                            >
                                <Minus className="w-4 h-4 text-gray-700" />
                            </Button>
                            <span className="text-sm font-medium min-w-[80px] text-center">{currentAmount} TIKET</span>
                            <Button 
                                type="button"
                                size="icon" 
                                className="w-6 h-6 bg-gray-200"
                                onClick={incrementAmount}
                                disabled={currentAmount >= 4}
                            >
                                <Plus className="w-4 h-4 text-gray-700" />
                            </Button>
                        </div>
                    </div>
                </div>
                <Button
                    className="text-white w-full bg-blue-800 hover:bg-blue-900"
                    size={"lg"}
                    type="submit"
                    disabled={packagePurchase.isPending || purchase.isPending}
                >
                    {packagePurchase.isPending || purchase.isPending ? (
                    <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                    </span>
                    ) : (
                    "Lanjutkan ke Pembayaran"
                    )}
              </Button>
            </form>

            <RequireLoginDialog
                onOpenChange={setShowNeedLogin}
                open={showNeedLogin}
                seasonLogo={activeSeason?.logo.url}
                callbackUrl={pathName}
                message="Untuk melanjutkan pembelian, silakan login terlebih dahulu."
             />
        </div>
    )
};

export default Transaction;
