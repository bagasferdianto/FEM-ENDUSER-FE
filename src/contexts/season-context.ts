"use client";

import { createContext, useContext } from "react";
import { Season } from "@/app/_models/response/season";

// create context
export const SeasonContext = createContext<Season | null>(null);

// custom hook
export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonContext.Provider");
  }
  return context;
};
