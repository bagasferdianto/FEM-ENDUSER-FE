import Image from "next/image";
import Link from "next/link";
import Notfound from "../../public/404.svg";

export default function NotFoundCatchAll() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center space-y-5 h-[400px] mb-1">
        <Image src={Notfound} alt="404 Not Found" width={300} height={300} />
        <div className="text-2xl font-bold">Oops! Halaman Tidak Ditemukan</div>
        <div>
          Sepertinya halaman yang Anda cari tidak tersedia atau telah
          dipindahkan. Kami mohon maaf atas ketidaknyamanannya!
        </div>
        <Link
          href="/"
          className="bg-blue-pfl py-2 px-5 text-sm text-white rounded-md"
        >
          Kembali Ke Halaman Utama
        </Link>
      </div>
    </div>
  );
}
