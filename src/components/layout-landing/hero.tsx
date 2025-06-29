"use client"

import { useSeason } from "@/contexts/season-context";
import Image from "next/image"
// import Navbar from "@/components/navbar/navbar";

const Hero: React.FC = () => {
    const activeSeason = useSeason();
    return (
        <section className="relative w-full h-screen">
            <div >
                <Image
                    src={ activeSeason?.banner.url || "/images/Header.svg?height=682&width=1440"}
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