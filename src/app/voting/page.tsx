'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import VoteConfirmationModal from '@/components/ui/vote-confirmation';
import MemberLayout from '@/components/layout-member';

const players = [
    {
        name: 'Raisal Anugrah',
        role: 'Flank',
        teamLogo: '/logos/team1.png',
        image: '/players/raisa.png',
        goals: 3,
        assists: 5,
        votes: 300,
        percentage: 50,
    },
    {
        name: 'Evan Soumilena',
        role: 'Pivot',
        teamLogo: '/logos/team2.png',
        image: '/players/evan.png',
        goals: 3,
        assists: 5,
        votes: 300,
        percentage: 50,
    },
    {
        name: 'Muhammad Sanjaya',
        role: 'Pivot',
        teamLogo: '/logos/team3.png',
        image: '/players/sanjaya.png',
        goals: 3,
        assists: 5,
        votes: 300,
        percentage: 50,
    },
    {
        name: 'Friski Dwiki Setriyadi',
        role: 'Anchor',
        teamLogo: '/logos/team4.png',
        image: '/players/friski.png',
        goals: 3,
        assists: 5,
        votes: 300,
        percentage: 50,
    },
];

const VotingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <MemberLayout withFooter>
            <div className="bg-white min-h-screen px-4 sm:px-8 md:px-16 py-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6 bg-gradient-to-r from-[#0E5889] to-[#0078FF] p-4 rounded-lg shadow-md">
                    <span className="text-white text-2xl font-semibold">← PFL Vote</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                    Vote Now! Player of The Series - Series 1
                </h1>
                <p className="text-gray-700 mb-6">
                    Voting untuk menentukan Player of The Series akan dibuka mulai 05 Mei 2025 hingga 10 Mei 2025. Pastikan Anda memberikan suara sebelum batas waktu berakhir!
                </p>

                {/* Countdown */}
                <div className="text-lg font-semibold text-blue-900 mb-8">
                    Voting akan berakhir dalam :{' '}
                    <span className="bg-blue-700 text-white px-4 py-2 rounded-lg ml-2">
                        3 Hari : 12 Jam : 27 Menit
                    </span>
                </div>

                {/* Players */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {players.map((player, idx) => (
                        <div
                            key={idx}
                            className="bg-white border rounded-lg shadow p-4 text-center"
                        >
                            <div className="relative w-full h-48 mb-4">
                                <Image
                                    src={player.image}
                                    alt={player.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="font-bold text-lg text-gray-900 mb-1">{player.name}</div>
                            <div className="text-sm text-gray-600 mb-2">{player.role}</div>
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition mb-3">
                                Vote Now
                            </button>
                            <VoteConfirmationModal
                                open={isModalOpen}
                                onOpenChange ={() => setIsModalOpen(false)}
                                onConfirm={() => {
                                    setIsModalOpen(false);
                                    alert('Vote berhasil!');
                                }}
                                playerName={player.name}
                                playerImage="/players/evan.png"
                                teamLogo="/logos/team2.png"
                            />
                            <p className="text-sm text-gray-700">
                                Performa : {player.goals} Gol, {player.assists} Assist
                                <br />
                                Total Vote Sementara : {player.votes} Voters
                            </p>
                            <div className="bg-blue-700 text-white mt-3 py-1 rounded-lg font-semibold">
                                Perolehan Suara : {player.percentage} %
                            </div>
                        </div>
                    ))}
                </div>

                {/* Langkah-langkah */}
                <div>
                    <h2 className="text-lg font-bold text-blue-800 mb-2">
                        Langkah-langkah Voting
                    </h2>
                    <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-2">
                        <li>Pastikan Anda telah melakukan login, atau jika belum memiliki akun silahkan registrasi terlebih dahulu.</li>
                        <li>Pastikan Anda telah melengkapi data diri Anda.</li>
                        <li>Klik tombol &quot;Vote Now&quot; pada pemain favoritmu.</li>
                        <li>Tunggu notifikasi bahwa voting berhasil.</li>
                    </ul>
                    <p className="text-sm text-red-600 italic">
                        *Catatan: Satu akun hanya bisa melakukan satu kali vote untuk setiap voting.
                    </p>
                </div>
            </div>
        </MemberLayout>
    );
};

export default VotingPage;
