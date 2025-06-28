"use-client";

import { useHttp } from "react-ohttp";
import { SeasonResponse } from "../_models/response/season";

export const useGetActiveSeason = () => {
  return useHttp<SeasonResponse>("/member/seasons/active");
}
