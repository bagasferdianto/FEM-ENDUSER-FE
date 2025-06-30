"use client";

import Image from "next/image";
import React from "react";
import MemberLayout from "@/components/layout-member";
import Header from "@/components/header-page/header-page";

const votingResult = {
  totalVotes: 3000,
  winner: {
    name: "EVAN SOUMILENA",
    role: "Anchor",
    team: "FAFAGE BANUA",
    logo: "/logos/fafage-banua.png",
    image: "/players/evan.png",
    goals: 9,
    assists: 7,
    percentage: 50,
  },
  others: [
    {
      name: "Raisal Anugrah",
      role: "Flank",
      teamLogo: "/logos/team1.png",
      image: "/players/raisa.png",
      goals: 3,
      assists: 5,
      percentage: 10,
    },
    {
      name: "Muhammad Sanjaya",
      role: "Pivot",
      teamLogo: "/logos/team2.png",
      image: "/players/sanjaya.png",
      goals: 3,
      assists: 5,
      percentage: 5,
    },
    {
      name: "Friski Dwiki Setriyadi",
      role: "Anchor",
      teamLogo: "/logos/team3.png",
      image: "/players/friski.png",
      goals: 3,
      assists: 5,
      percentage: 17,
    },
  ],
};

export default function EndedVote() {
  const { winner, totalVotes, others } = votingResult;

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white min-h-screen px-4 sm:px-8 md:px-16 pt-28 pb-14">
        <Header title="PFL Vote" />
        {/* Description */}
        <p className="text-gray-800 text-sm sm:text-base">
          Voting telah ditutup dan berikut ini adalah hasil perolehan voting
          Player of The Series - Series 1
        </p>
        <div className="flex flex-col items-center bg-white py-16">
          <div className="flex-1 justify-center items-center space-y-16 w-full max-w-6xl">
            {/* Winner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="w-full aspect-[1/1] relative rounded-xl overflow-hidden shadow">
                <Image
                  src={winner.image}
                  alt={winner.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-start items-start">
                  <Image
                    src={winner.logo}
                    alt="team logo"
                    width={32}
                    height={32}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
                  Player of The Series - Series 1
                </h2>
                <h3 className="text-xl font-semibold text-black">
                  {winner.name}
                </h3>
                <p className="text-sm text-gray-700">{winner.role}</p>
                <div className="flex items-center gap-2">
                  <Image
                    src={winner.logo}
                    alt="team logo"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {winner.team}
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  Performa : {winner.goals} Gol, {winner.assists} Assist
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <span>Perolehan Suara:</span>
                  <div className="bg-blue-pfl text-white px-2 py-1 rounded font-bold text-sm min-w-[48px] text-center">
                    {winner.percentage}%
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total Votes : {totalVotes.toLocaleString()} Voters
                </p>
              </div>
            </div>

            {/* Others */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {others.map((player, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden bg-white"
                >
                  <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden">
                    <Image
                      src={player.image}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-start items-start">
                      <Image
                        src={player.teamLogo}
                        alt="team logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-center items-center">
                      <h4 className="text-lg font-bold translate-y-20">
                        {player.name}
                      </h4>
                      <p className="text-sm translate-y-20">{player.role}</p>
                    </div>
                  </div>
                  <div className="py-4 text-sm space-y-2 text-gray-700">
                    <p>
                      Performa : {player.goals} Gol, {player.assists} Assist
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="flex w-fit">Perolehan Suara :</span>
                      <div className="bg-blue-pfl text-white p-2 rounded text-md font-medium flex-1 text-center">
                        {player.percentage} %
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}
