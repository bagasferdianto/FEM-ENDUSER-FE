"use client";

import Image from "next/image";
import React, { useState } from "react";
import VoteConfirmationModal from "@/components/ui/vote-confirmation";
import MemberLayout from "@/components/layout-member";
import { Button } from "@/components/ui/button";
import Header from "@/components/header-page/header-page";
import FailedVote from "../_models/failed-vote";
import SuccessVote from "../_models/success-vote";

interface Player {
  name: string;
  role: string;
  teamLogo: string;
  image: string;
  goals: number;
  assists: number;
  votes: number;
  percentage: number;
}

const players: Player[] = [
  {
    name: "Raisal Anugrah",
    role: "Flank",
    teamLogo: "/logos/team1.png",
    image: "/players/raisa.png",
    goals: 3,
    assists: 5,
    votes: 300,
    percentage: 50,
  },
  {
    name: "Evan Soumilena",
    role: "Pivot",
    teamLogo: "/logos/team2.png",
    image: "/players/evan.png",
    goals: 3,
    assists: 5,
    votes: 300,
    percentage: 50,
  },
  {
    name: "Muhammad Sanjaya",
    role: "Pivot",
    teamLogo: "/logos/team3.png",
    image: "/players/sanjaya.png",
    goals: 3,
    assists: 5,
    votes: 300,
    percentage: 50,
  },
  {
    name: "Friski Dwiki Setriyadi",
    role: "Anchor",
    teamLogo: "/logos/team4.png",
    image: "/players/friski.png",
    goals: 3,
    assists: 5,
    votes: 300,
    percentage: 50,
  },
];

const RunningVote = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"success" | "failed" | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white min-h-screen px-4 sm:px-8 md:px-16 py-28">
        <Header title="PFL Vote" />

        <h1 className="text-2xl sm:text-3xl font-bold text-blue-pfl mb-2">
          Vote Now! Player of The Series - Series 1
        </h1>
        <p className="text-gray-700 mb-6">
          Voting untuk menentukan Player of The Series akan dibuka mulai 05 Mei
          2025 hingga 10 Mei 2025. Pastikan Anda memberikan suara sebelum batas
          waktu berakhir!
        </p>

        {/* Countdown */}
        <div className="text-lg font-semibold text-blue-pfl mb-8">
          Voting akan berakhir dalam:{" "}
          <span className="bg-blue-pfl text-white px-4 py-2 rounded-lg ml-2">
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
              <div className="font-bold text-lg text-gray-900 mb-1">
                {player.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">{player.role}</div>
              <Button
                onClick={() => {
                  setSelectedPlayer(player);
                  setIsModalOpen(true);
                }}
                className="bg-blue-pfl text-white px-4 py-2 rounded hover:bg-blue-800 transition mb-3"
              >
                Vote Now
              </Button>
              <p className="text-sm text-gray-700">
                Performa : {player.goals} Gol, {player.assists} Assist
                <br />
                Total Vote Sementara : {player.votes} Voters
              </p>
              <div className="flex flex-row text-sm text-gray-700 items-center w-full gap-2">
                Perolehan Suara :
                <div className="bg-blue-pfl text-white mt-3 py-1 rounded font-medium flex-1">
                  {player.percentage} %
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Langkah-langkah */}
        <div>
          <h2 className="text-lg font-bold text-blue-pfl mb-2">
            Langkah-langkah Voting
          </h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-2">
            <li>
              Pastikan Anda telah melakukan login, atau jika belum memiliki akun
              silahkan registrasi terlebih dahulu.
            </li>
            <li>Pastikan Anda telah melengkapi data diri Anda.</li>
            <li>Klik tombol &quot;Vote Now&quot; pada pemain favoritmu.</li>
            <li>Tunggu notifikasi bahwa voting berhasil.</li>
          </ul>
          <p className="text-sm text-red-600 italic">
            *Catatan: Satu akun hanya bisa melakukan satu kali vote untuk setiap
            voting.
          </p>
        </div>
      </div>

      {/* Vote Confirmation Modal */}
      {selectedPlayer && (
        <VoteConfirmationModal
          open={isModalOpen}
          onOpenChange={() => setIsModalOpen(false)}
          onConfirm={() => {
            setIsModalOpen(false);
            const isSuccess = Math.random() > 0.3;
            setTimeout(() => {
              setVoteStatus(isSuccess ? "success" : "failed");
            }, 300);
          }}
          playerName={selectedPlayer.name}
          playerImage={selectedPlayer.image}
          teamLogo={selectedPlayer.teamLogo}
        />
      )}

      {/* Success Modal */}
      {voteStatus === "success" && (
        <SuccessVote
          open={true}
          onClose={() => setVoteStatus(null)}
        />
      )}

      {/* Failed Modal */}
      {voteStatus === "failed" && (
        <FailedVote
          open={true}
          onClose={() => setVoteStatus(null)}
        />
      )}
    </MemberLayout>
  );
};

export default RunningVote;
