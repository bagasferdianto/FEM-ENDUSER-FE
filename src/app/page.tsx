"use client";

import Hero from "@/components/layout-landing/hero";
import LineUp from "@/components/layout-landing/line-up";
import Matches from "@/components/layout-landing/matches";
import Voting from "@/components/layout-landing/voting";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { useGetActiveSeason } from "./_services/season";
import { useEffect, useState } from "react";
import { Season } from "./_models/response/season";

export default function Home() {
  const { data: season, isFetching } = useGetActiveSeason();
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);

  useEffect(() => {
    if (!isFetching) {
      if (season?.status === 400) {
        setActiveSeason(null);
      } else {
        setActiveSeason(season?.data || null);
      }
    }
  }, [season, isFetching]);

  return (
    <div className="min-h-screen">
      <Navbar activeSeason={activeSeason} />
      <Hero activeSeason={activeSeason}/>
      <Matches activeSeason={activeSeason} />
      <Voting />
      <LineUp />
      <Footer />
    </div>
  );
}
