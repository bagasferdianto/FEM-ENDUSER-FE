"use client";

import MemberLayout from "@/components/layout-member";
import Image from "next/image";
import { z } from "zod";
import { useHttpMutation } from "react-ohttp";
import { toast } from "sonner";
import { use, useCallback, useEffect, useState } from "react";
import LoadingCard from "@/components/ui/loading";
import Link from "next/link";

interface VerificationPageProps {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    email?: string;
  }>;
}

const verifySchema = z.object({
  token: z.string(),
});

const resendSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

const VerificationPage = ({ params, searchParams }: VerificationPageProps) => {
  const { token } = use(params);
  const { email } = use(searchParams);

  const [isVerificationSuccess, setIsVerificationSuccess] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { mutate, isPending } = useHttpMutation<z.infer<typeof verifySchema>>(
    "/member/auth/verify-email",
    {
      method: "POST",
      queryOptions: {
        onError: () => {
          toast.error("Token verifikasi tidak valid");
          setIsVerificationSuccess(false);
          setIsInitialLoading(false);
        },
        onSuccess: () => {
          toast.success("Email berhasil diverifikasi");
          setIsVerificationSuccess(true);
          setIsInitialLoading(false);
        },
      },
    }
  );

  const { mutate: resend, isPending: isResending } = useHttpMutation<
    z.infer<typeof resendSchema>
  >("/member/auth/resend-email-verification", {
    method: "POST",
    queryOptions: {
      onError: (error) => {
        toast.error(
          error?.data?.message || "Gagal mengirim ulang email verifikasi."
        );
      },
      onSuccess: () => {
        toast.success("Email verifikasi berhasil dikirim ulang.");
      },
    },
  });

  useEffect(() => {
    if (token && !hasAttemptedVerification) {
      setHasAttemptedVerification(true);
      const validated = verifySchema.parse({ token });
      mutate({ body: validated });
    } else if (!token) {
      toast.error("Token verifikasi tidak valid");
      setIsVerificationSuccess(false);
      setIsInitialLoading(false);
    }
  }, [token, mutate, hasAttemptedVerification]);

  const handleResendEmail = useCallback(() => {
    if (email) {
      const validated = resendSchema.parse({ email });
      resend({ body: validated });
    }
  }, [email, resend]);

  if (isPending || isInitialLoading) {
    return (
      <MemberLayout>
        <LoadingCard loadingMessage="Memverifikasi email" />
      </MemberLayout>
    );
  }

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col items-center justify-center min-h-full px-4 text-center w-full">
        {isVerificationSuccess ? (
          <div className="flex flex-col h-screen justify-center items-center space-y-4 w-full max-w-md">
            <Image
              src="/images/circle-check.svg"
              alt="Success"
              width={140}
              height={140}
            />
            <h1 className="text-2xl font-bold">Verifikasi Berhasil!</h1>
            <p className="text-base md:text-lg text-center">
              Email Anda berhasil diverifikasi, dan kini Anda dapat mengakses
              seluruh fitur Pro Futsal League
            </p>
            <Link
              href="/login"
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto"
            >
              Login Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col h-screen justify-center items-center space-y-4 w-full max-w-md">
            <Image
              src="/images/circle-x.svg"
              alt="Failed"
              width={140}
              height={140}
            />
            <h1 className="text-2xl font-bold">Verifikasi Gagal!</h1>
            <p className="text-base md:text-lg text-center">
              Email Anda gagal diverifikasi, silahkan ulangi proses verifikasi
              dengan menekan tombol di bawah ini.
            </p>
            <button
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto disabled:opacity-50"
            >
              {isResending ? "Mengirim..." : "Verifikasi Ulang"}
            </button>
          </div>
        )}
      </div>
    </MemberLayout>
  );
};

export default VerificationPage;
