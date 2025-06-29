"use client";

import Image from "next/image";
import Link from "next/link";
import Notfound from "../../public/404.svg";
import MemberLayout from "@/components/layout-member";

export default function NotFoundCatchAll() {
  return (
    <MemberLayout withFooter>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center space-y-5 mb-1 px-4">
          <Image src={Notfound} alt="404 Not Found" width={300} height={300} />
          <div className="text-2xl font-bold text-center">Oops! Halaman Tidak Ditemukan</div>
          <p className="text-muted-foreground text-center">
            Sepertinya halaman yang Anda cari tidak tersedia atau telah
            dipindahkan. Kami mohon maaf atas ketidaknyamanannya!
          </p>
          <Link
            href="/"
            className="bg-blue-pfl py-2 px-5 text-sm text-white rounded-md"
          >
            Kembali Ke Halaman Utama
          </Link>
        </div>
      </div>
    </MemberLayout>
  );
}
