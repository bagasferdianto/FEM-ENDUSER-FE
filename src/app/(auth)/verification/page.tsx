'use client';

import MemberLayout from '@/components/layout-member';
import Image from 'next/image';

const VerificationPage = () => {
    const isVerificationSuccess = false;

    return (
        <MemberLayout>
            <div className="flex flex-col items-center justify-center min-h-full px-4 text-center w-full">
                {isVerificationSuccess ? (
                    <div className="flex flex-col min-h-[calc(100vh-90px)] justify-center items-center space-y-4 w-full max-w-md">
                        <Image src="/images/circle-check.svg" alt="Success" width={140} height={140} />
                        <h1 className="text-2xl font-bold">Verifikasi Berhasil!</h1>
                        <p className="text-base md:text-lg text-center">
                            Email Anda berhasil diverifikasi, dan kini Anda dapat mengakses seluruh fitur Pro Futsal League
                        </p>
                        <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto">
                            Login Sekarang
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col min-h-[calc(100vh-90px)] justify-center items-center space-y-4 w-full max-w-md">
                        <Image src="/images/circle-x.svg" alt="Failed" width={140} height={140} />
                        <h1 className="text-2xl font-bold">Verifikasi Gagal!</h1>
                        <p className="text-base md:text-lg text-center">
                            Email Anda gagal diverifikasi, silahkan ulangi proses verifikasi dengan menekan tombol di bawah ini.
                        </p>
                        <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto">
                            Verifikasi Ulang
                        </button>
                    </div>
                )}
            </div>
        </ MemberLayout>
    );
};

export default VerificationPage;
