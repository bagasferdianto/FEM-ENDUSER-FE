'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
};

const Header: React.FC<Props> = ({ title }) => {
  const router = useRouter();

  return (
    <div className="relative flex items-center gap-3 mb-6 bg-gradient-to-r from-[#0E5889] to-[#0078FF] p-4 rounded-lg shadow-md">
      <Image
        src="/bg/pattern-1.png"
        alt=""
        fill
        className="object-cover z-0"
      />

      <button
        onClick={() => router.back()}
        className="z-10 text-white hover:opacity-80 transition"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <span className="text-white text-2xl font-semibold z-10">
        {title}
      </span>
    </div>
  );
};

export default Header;
