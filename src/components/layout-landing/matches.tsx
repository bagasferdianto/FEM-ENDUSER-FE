"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { Season } from "@/app/_models/response/season";
import { useGetSeriesWithTickets } from "@/app/_services/series";
import EmptyCard from "../ui/empty-card";
import { formatDate, formatRupiah } from "@/lib/utils";
import Image from "next/image";
import DefaultTeamLogo from "@/app/assets/images/default-team.svg"

interface MatchesProps {
  activeSeason: Season | null;
}

const Matches: React.FC<MatchesProps> = ({ activeSeason }) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const { data: series } = useGetSeriesWithTickets({
        page: page.toString(),
        sort: "startDate",
        dir: "asc",
        limit: "1",
        seasonId: activeSeason?.id || "none",
    });

    useEffect(() => {
        if (series?.data?.total && series.data.limit) {
            const calculatedTotalPage = Math.ceil(series.data.total / series.data.limit);
            setTotalPage(calculatedTotalPage);
        }
    }, [series]);

    const seriesList = series?.data?.list || [];

    const handleNext = () => {
        if (page < totalPage) setPage(prev => prev + 1);
    };
    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const formatDateDMY = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    return (
        <section className="p-16 bg-white">
            <div className="container mx-auto">
                {seriesList.map((series, index) => (
                    <div key={index} className="relative group">

                        {page > 1 && (
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-600  bg-opacity-50 backdrop-blur-md text-white p-3 rounded-full shadow-md opacity-0 hover:scale-110 group-hover:opacity-100 transition-opacity duration-300 z-10 -translate-x-6"
                            >
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                        )}
                        {page < totalPage && (
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 backdrop-blur-md text-white p-3 rounded-full shadow-md opacity-0 hover:scale-110 group-hover:opacity-100 transition-opacity duration-300 z-10 translate-x-6"
                            >
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        )}

                        <div className="bg-blue-pfl bg-[url('/bg/pattern-2.png')] bg-cover rounded-lg mt-4 py-8 px-10 shadow-lg">
                            <h2 className="text-2xl font-bold text-center mb-2 text-white">Pertandingan Terdekat</h2>
                            <p className="text-center text-white mb-8">Jangan sampai ketinggalan pada setiap pertandingannya</p>

                            <div className="space-y-12">
                                {series.tickets === null ? (
                                    <EmptyCard emptyTitle="Tidak ada data pertandingan"></EmptyCard>
                                ) : (
                                    series.tickets.map((ticket, ticketIndex) => (
                                        <div key={ticketIndex} className="rounded-lg overflow-hidden">
                                            <div className="text-white flex items-center w-full h-[70px] overflow-hidden">
                                                <div className="flex-shrink-0 flex items-center space-x-4 bg-[#FF113C] px-[32px] py-[4px] h-full">
                                                    <span className="font-semibold whitespace-nowrap">{series.name}: {ticket.name} ({formatDateDMY(ticket.date)})</span>
                                                </div>
                                                <div className="flex items-center space-x-4 bg-[#960E27] w-full h-full px-[32px] py-[4px]">
                                                    <div className="flex justify-between items-center w-full">
                                                        <span className="text-white font-semibold">Ticket For 1 Day</span>
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold px-4">{formatRupiah(ticket.price)}</span>
                                                            <Button size="sm" className="bg-blue-pfl hover:bg-blue-800">Beli Tiket</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white">
                                                {ticket.matchs === null ? (
                                                    <EmptyCard emptyTitle="Tidak ada data pertandingan"></EmptyCard>
                                                ) : (
                                                    ticket.matchs.map((match, matchIndex) => (
                                                        <div key={matchIndex} className="flex items-center justify-between p-4 border-b last:border-b-0">
                                                            <div className="flex items-center justify-start gap-8">
                                                                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                                                                    {matchIndex + 1}
                                                                </span>
                                                                <div className="flex items-center justify-start w-56 gap-2">
                                                                    <Image
                                                                        src={match.homeSeasonTeam.team.logo === "" ? DefaultTeamLogo : match.homeSeasonTeam.team.logo}
                                                                        width={30}
                                                                        height={30}
                                                                        alt="team logo"
                                                                    />
                                                                    <div className="text-xs">{match.homeSeasonTeam.team.name || "Team Unknown"}</div>
                                                                </div>
                                                                <div className="flex items-center justify-center w-8 h-8 text-xs font-semibold text-white bg-[#DC2626] rounded-full">
                                                                    VS
                                                                </div>
                                                                <div className="flex items-center justify-start gap-2">
                                                                    <Image
                                                                        src={match.awaySeasonTeam.team.logo === "" ? DefaultTeamLogo : match.awaySeasonTeam.team.logo}
                                                                        width={30}
                                                                        height={30}
                                                                        alt="team logo"
                                                                    />
                                                                    <div className="text-xs">{match.awaySeasonTeam.team.name || "Team Unknown"}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                                <div className="flex items-center space-x-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{match.time}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{series.venue.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="my-6 bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <span className="font-semibold">Beli 1 Series Match</span>
                                    <span className="ml-2 text-sm">{formatDate(series.startDate)} - {formatDate(series.endDate)}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="font-semibold"> {formatRupiah(series.price)} </span>
                                    <Button className="bg-blue-pfl hover:bg-blue-900">Beli Tiket Bundling</Button>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({ length: totalPage }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`w-2 h-2 rounded-full ${i + 1 === page ? "bg-white" : "bg-gray-300"}`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>

    );
};

export default Matches;