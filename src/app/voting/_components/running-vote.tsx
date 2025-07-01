"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import VoteConfirmationModal from "@/components/ui/vote-confirmation";
import MemberLayout from "@/components/layout-member";
import { Button } from "@/components/ui/button";
import Header from "@/components/header-page/header-page";
import FailedVote from "../_models/failed-vote";
import SuccessVote from "../_models/success-vote";
import { Voting } from "@/app/_models/response/voting";
import { Candidate } from "@/app/_models/response/candidate";
import { formatDate } from "@/lib/utils";
import LoadingCard from "@/components/ui/loading";
import { useSeason } from "@/contexts/season-context";
import Cookies from "js-cookie";
import RequireLoginDialog from "@/components/ui/require-login-dialog";
import { usePathname } from "next/navigation";

interface RunningVoteProps {
  voting: Voting | null;
  candidates: Candidate[] | null;
}

const RunningVote: React.FC<RunningVoteProps> = ({
  voting,
  candidates,
}: RunningVoteProps) => {
  const [showNeedLogin, setShowNeedLogin] = useState(false);
  const activeSeason = useSeason();
  const pathName = usePathname();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"success" | "failed" | null>(
    null
  );
  const [selectedPlayer, setSelectedPlayer] = useState<Candidate | null>(null);

  useEffect(() => {
    if (voting) {
      const end = new Date(voting.endDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        setTimeLeft(diff);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [voting]);

  if (!voting || !candidates) {
    return (
      <MemberLayout withFooter>
        <LoadingCard loadingMessage="Memuat data kandidat..." />
      </MemberLayout>
    );
  }
  const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    return `${days} Hari : ${hours} Jam : ${minutes} Menit : ${secs} Detik`;
  };

  return (
    <MemberLayout withFooter>
      <div className="flex flex-col gap-4 bg-white min-h-screen px-4 sm:px-8 md:px-16 py-28">
        <Header title="PFL Vote" />

        <h1 className="text-2xl sm:text-3xl font-bold text-blue-pfl mb-2">
          Vote Now! {voting?.title}
        </h1>
        <p className="text-gray-700 mb-6">
          Voting untuk menentukan Player of The Series akan dibuka mulai{" "}
          {voting?.startDate ? formatDate(voting?.startDate) : ""} hingga{" "}
          {voting?.startDate ? formatDate(voting?.endDate) : ""}. Pastikan Anda
          memberikan suara sebelum batas waktu berakhir!
        </p>

        {/* Countdown */}
        <div className="text-lg font-semibold text-blue-pfl mb-8">
          Voting akan berakhir dalam:{" "}
          <span className="bg-blue-pfl text-white px-4 py-2 rounded-lg ml-2">
            {formatTimeLeft(timeLeft)}
          </span>
        </div>

        {/* Players */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {candidates?.map((player, idx) => (
            <div
              key={idx}
              className="overflow-hidden bg-white border rounded-lg shadow"
            >
              {/* Bagian gambar sama persis */}
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

                <div className="absolute inset-0 px-4 py-3 text-white flex flex-col justify-center items-center">
                  <h4 className="text-lg font-bold translate-y-20">
                    {player.seasonTeamPlayer.player.name}
                  </h4>
                  <p className="text-sm translate-y-20">
                    {player.seasonTeamPlayer.position}
                  </p>
                </div>
              </div>

              {/* Bagian konten bawah */}
              <div className="py-4 px-4 text-sm space-y-2 text-gray-700 text-center">
                <Button
                  onClick={() => {
                    const token = Cookies.get("auth_token"); // Atau nama cookie auth-mu
                    if (!token) {
                      setShowNeedLogin(true);
                      return; // Stop di sini
                    }
                    setSelectedPlayer(player);
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-pfl text-white px-4 py-2 rounded hover:bg-blue-800 transition w-full"
                >
                  Vote Now
                </Button>

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

                <p className="text-sm text-gray-700">
                  Total Vote Sementara : {player.voters.count} Voters
                </p>
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
          }}
          onSuccess={() => {
            setVoteStatus("success");
          }}
          onError={() => {
            setVoteStatus("failed");
          }}
          seasonLogo={activeSeason?.logo.url ?? ""}
          votingId={voting.id}
          playerId={selectedPlayer.id}
          playerName={selectedPlayer.seasonTeamPlayer.player.name}
          playerImage={selectedPlayer.seasonTeamPlayer.image}
          teamLogo={selectedPlayer.seasonTeam.team.logo}
        />
      )}

      {/* Success Modal */}
      {voteStatus === "success" && (
        <SuccessVote open={true} onClose={() => setVoteStatus(null)} />
      )}

      {/* Failed Modal */}
      {voteStatus === "failed" && (
        <FailedVote open={true} onClose={() => setVoteStatus(null)} />
      )}

      <RequireLoginDialog
        onOpenChange={setShowNeedLogin}
        open={showNeedLogin}
        seasonLogo={activeSeason?.logo.url}
        callbackUrl={pathName}
        message="Untuk melanjutkan voting, silakan login terlebih dahulu."
      />
    </MemberLayout>
  );
};

export default RunningVote;
