"use client"

import Image from "next/image"
// import Navbar from "@/components/navbar/navbar";

const Hero: React.FC = () => {
    return (
        <section className="relative w-full h-[76vh]">
            <div >
                <Image
                    src="/images/Header.svg?height=682&width=1440"
                    alt="Stadium Background"
                    fill
                    className="object-cover"
                />
            </div>
            {/* <header className="absolute top-0 left-0 w-full px-4 py-3 z-20">
                <Navbar />
            </header> */}
        </section>
    );
};

export default Hero;