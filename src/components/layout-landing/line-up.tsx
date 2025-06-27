"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

const LineUp: React.FC = () => {
    return (
        <section className="p-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-4 items-center justify-between relative">
                    <div>
                        <Image
                            src="/images/lineup.png?height=200&width=600"
                            alt="Team Photo"
                            width={500}
                            height={200}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="container rounded-lg p-10 shadow-md">
                        <h2 className="text-3xl font-bold text-blue-800 mb-4">TIM & LINE-UP</h2>
                        <p className="text-gray-600 mb-6">
                            Tim dan line-up di Professional Futsal League (PFL) Indonesia menampilkan para pemain terbaik dari
                            berbagai daerah membawa semangat dan kompetisi tinggi ke lapangan futsal. Dengan keberagaman strategi
                            dan bakat, PFL Indonesia semakin memperkuat posisinya sebagai liga futsal terkemuka di tanah air.
                        </p>
                        <Button className="bg-blue-800 hover:bg-blue-900 text-white">Lihat tim & squad</Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LineUp;