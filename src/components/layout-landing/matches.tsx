"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

const Matches: React.FC = () => {
    const matches = [
        {
            series: "Series 1 Match Day 1 (03-05-2025)",
            ticketPrice: "Rp25.000,00",
            games: [
                { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 10:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 12:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 14:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "03 Mei 2025 / 16:00 WIB", venue: "GOR Sritex Arena" },
            ],
        },
        {
            series: "Series 1 Match Day 2 (04-05-2025)",
            ticketPrice: "Rp25.000,00",
            games: [
                { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 10:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 12:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 14:00 WIB", venue: "GOR Sritex Arena" },
                { teamA: "TIM A", teamB: "TIM B", time: "04 Mei 2025 / 16:00 WIB", venue: "GOR Sritex Arena" },
            ],
        },
    ]

    return (
        <section className="p-16 bg-white">
            <div className="container mx-auto">
                <div className="bg-[#00009C] rounded-lg py-8 px-10 shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-2 text-white">Pertandingan Terdekat</h2>
                    <p className="text-center text-white mb-8">Jangan sampai ketinggalan pada setiap pertandingannya</p>

                    <div className="space-y-12">
                        {matches.map((matchDay, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                                <div className="bg-[#FF113C] text-white p-3 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold">{matchDay.series}</span>
                                        <Badge variant="secondary" className="bg-white text-[#FF113C]">
                                            Ticket For 1 Day
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="font-semibold">{matchDay.ticketPrice}</span>
                                        <Button size="sm" className="bg-blue-800 hover:bg-blue-900">
                                            Beli Tiket
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-white">
                                    {matchDay.games.map((game, gameIndex) => (
                                        <div key={gameIndex} className="flex items-center justify-between p-4 border-b last:border-b-0">
                                            <div className="flex items-center space-x-4">
                                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                                                    {gameIndex + 1}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                                                    <span className="font-semibold">{game.teamA}</span>
                                                </div>
                                                <span className="text-red-500 font-bold">VS</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                                    <span className="font-semibold">{game.teamB}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{game.time}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{game.venue}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <span className="font-semibold">Beli 1 Series Match</span>
                            <span className="ml-2 text-sm">03-04 Mei 2025</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="font-semibold">Rp40.000,00</span>
                            <Button className="bg-blue-800 hover:bg-blue-900">Beli Tiket Bundling</Button>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6 space-x-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i === 0 ? "bg-blue-600" : "bg-gray-300"}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

    );
};

export default Matches;