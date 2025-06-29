"use client";

import { useGetActiveSeason } from "@/app/_services/season";
import Footer from "./footer";
import Navbar from "./navbar";
import { Season } from "@/app/_models/response/season";
import { useEffect, useState } from "react";
import { SeasonContext } from "@/contexts/season-context";

export default function MemberLayout({
  children,
  withFooter = false,
}: {
  children: React.ReactNode;
  withFooter?: boolean;
}) {
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
    <SeasonContext.Provider value={activeSeason}>
      <div className="min-h-screen">
        <Navbar />
        <div className="p-8">
        {children}
        </div>  
        {withFooter && <Footer />}
      </div>
    </SeasonContext.Provider>
  );
}
