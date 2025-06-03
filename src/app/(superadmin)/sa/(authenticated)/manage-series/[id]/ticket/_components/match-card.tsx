import Image from "next/image";
import { Match } from "../../../../_models/response/ticket";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { PackageOpen } from "lucide-react";
import DefaultTeamLogo from "@/app/assets/images/default-team.svg"

interface MatchTableProps {
  matchs: Match[];
}

export default function MatchCard({ matchs }: MatchTableProps) {
  return (
    <div className="mb-5 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tim Yang Bertanding</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead>Tempat/Kota</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(!matchs || matchs.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="h-72">
                <Card className="border-none shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <PackageOpen className="w-16 h-16 mb-4" strokeWidth={0.5} />
                    <h3 className="text-xl font-semibold mb-2">
                      Belum Ada Data Jadwal Pertandingan
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Silahkan Atur Jadwal Pertandingan
                    </p>
                  </CardContent>
                </Card>
              </TableCell>
            </TableRow>
          )}
          {matchs &&
            matchs.map((match: Match, index: number) => (
              <TableRow key={index} className="font-medium">
                <TableCell>
                  <div className="flex items-center justify-start gap-8">
                    <div className="flex items-center justify-start w-56 gap-2">
                      <Image
                        src={match.homeSeasonTeam.team.logo === "" ? DefaultTeamLogo : match.homeSeasonTeam.team.logo}
                        width={30}
                        height={30}
                        alt="team logo"
                        className=""
                      />
                      <div className="text-xs ">{match.homeSeasonTeam.team.name === "" ? "Team Unknown" : match.homeSeasonTeam.team.name}</div>
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
                        className=""
                      />
                      <div className="text-xs ">{match.awaySeasonTeam.team.name === "" ? "Team Unknown" : match.awaySeasonTeam.team.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">{match.time}</TableCell>
                <TableCell className="text-xs uppercase">
                  {match.venue?.name}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
