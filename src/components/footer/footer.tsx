"use client"

import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#1a1a2e] text-white p-16">
            <div className="container">
                <div className="grid justify-between md:grid-cols-3 gap-8 items-start">
                    <div className="md:col-span-2 space-y-6">
                        <div className="w-32 h-10 flex items-center justify-center relative">
                            <Image
                                src="/images/PFL-Logo-Putih.png"
                                alt="PFL Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-gray-300 text-sm max-w-[299px]">
                            Kompetisi utama futsal di tingkat nasional dan berada di Indonesia yang diselenggarakan Federasi Futsal
                            Indonesia.
                        </p>
                    </div>

                    <div className="flex space-x-10 justify-end">
                        <div>
                            <h3 className="font-semibold mb-5">Pro Futsal League</h3>
                            <ul className="space-y-5 text-sm text-gray-300">
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Jadwal Pertandingan
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Voting
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:text-white">
                                        Tim
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-5">Kontak Kami</h3>
                            <div className="space-y-5 text-sm text-gray-300">
                                <div className="flex space-x-3 mt-4">
                                    <Facebook className="w-5 h-5 hover:text-blue-400 cursor-pointer" />
                                    <Instagram className="w-5 h-5 hover:text-pink-400 cursor-pointer" />
                                    <Youtube className="w-5 h-5 hover:text-red-400 cursor-pointer" />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4" />
                                    <span>+62 123-456-7890</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4" />
                                    <span>admin@profutsalleague</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;