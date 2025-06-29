'use client';

import Image from "next/image";

type Props = {
    title: string;
};

const Header: React.FC<Props> = ({
    title,
}) => {
    return (
        < div className="relative flex items-center gap-2 mb-6 bg-gradient-to-r from-[#0E5889] to-[#0078FF] p-4 rounded-lg shadow-md" >
            <Image
                src="/bg/pattern-1.png"
                alt=""
                fill
                className='object-cover z-0'
            />
            <span className="text-white text-2xl font-semibold z-10">← {title} </span>
        </div >
    );
};

export default Header;
