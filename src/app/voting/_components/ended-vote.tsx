"use client";

import Image from "next/image";
import React from "react";
import MemberLayout from "@/components/layout-member";
import Header from "@/components/header-page/header-page";
import { Voting } from "@/app/_models/response/voting";
import { Candidate } from "@/app/_models/response/candidate";
import LoadingCard from "@/components/ui/loading";

interface EndedVoteProps {
  voting: Voting | null;
  candidates: Candidate[] | null;
}

export default function EndedVote({ voting, candidates }: EndedVoteProps) {
  if (!voting || !candidates) {
    return (
      <MemberLayout withFooter>
        <LoadingCard loadingMessage="Memuat data kandidat..." />
      </MemberLayout>
    );
  }

  const winner = candidates ? candidates[0] : null;
  const others = candidates ? candidates.slice(1) : [];

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white min-h-screen px-4 sm:px-8 md:px-16 pt-28 pb-14">
        <Header title="PFL Vote" />
        {/* Description */}
        <p className="text-gray-800 text-sm sm:text-base">
          Voting telah ditutup dan berikut ini adalah hasil perolehan voting berjudul {voting?.title ?? "-"}
        </p>
        <div className="flex flex-col items-center bg-white py-16">
          <div className="flex-1 justify-center items-center space-y-16 w-full max-w-6xl">
            {/* Winner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="w-full aspect-[1/1] relative rounded-xl overflow-hidden shadow">
                <Image
                  src={winner?.seasonTeamPlayer.image ?? ""}
                  alt={winner?.seasonTeamPlayer.player.name ?? "Winner"}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-start items-start">
                  <Image
                    src={winner?.seasonTeam.team.logo ?? ""}
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
                  {winner?.seasonTeamPlayer.player.name ?? "Winner"}
                </h3>
                <p className="text-sm text-gray-700">
                  {winner?.seasonTeamPlayer.position ?? ""}
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    src={winner?.seasonTeam.team.logo ?? ""}
                    alt="team logo"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {winner?.seasonTeam.team.name ?? ""}
                  </span>
                </div>
                {winner?.performance && (
                  <p className="text-sm text-gray-700">
                    Performa:{" "}
                    {[
                      winner.performance.goal > 0 &&
                        `${winner.performance.goal} Gol`,
                      winner.performance.assist > 0 &&
                        `${winner.performance.assist} Assist`,
                      winner.performance.save > 0 &&
                        `${winner.performance.save} Save`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <span>Perolehan Suara:</span>
                  <div className="bg-blue-pfl text-white px-2 py-1 rounded font-bold text-sm min-w-[48px] text-center">
                    {winner?.voters.percentage ?? 0}%
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Total Votes : {winner?.voters.count ?? 0} Voters
                </p>
              </div>
            </div>

            {/* Others */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {others.map((player, idx) => (
                <div key={idx} className="overflow-hidden bg-white">
                  <div className="w-full aspect-[4/5] relative rounded-lg overflow-hidden">
                    <Image
                      src={player.seasonTeamPlayer.image}
                      alt={player.seasonTeamPlayer.player.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-start items-start">
                      <Image
                        src={player.seasonTeam.team.logo}
                        alt="team logo"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-3 text-white flex flex-col justify-center items-center">
                      <h4 className="text-lg font-bold translate-y-20">
                        {player.seasonTeamPlayer.player.name}
                      </h4>
                      <p className="text-sm translate-y-20">
                        {player.seasonTeamPlayer.position}
                      </p>
                    </div>
                  </div>
                  <div className="py-4 text-sm space-y-2 text-gray-700">
                    {player.performance && (
                      <p>
                        Performa:{" "}
                        {[
                          player.performance.goal > 0 &&
                            `${player.performance.goal} Gol`,
                          player.performance.assist > 0 &&
                            `${player.performance.assist} Assist`,
                          player.performance.save > 0 &&
                            `${player.performance.save} Save`,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="flex w-fit">Perolehan Suara :</span>
                      <div className="bg-blue-pfl text-white p-2 rounded text-md font-medium flex-1 text-center">
                        {player.voters.percentage} %
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
