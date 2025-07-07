"use-client";

import { useHttp } from "@dhoniaridho/react-ohttp";
import { SeasonResponse } from "../_models/response/season";

export const useGetActiveSeason = () => {
  return useHttp<SeasonResponse>("/member/seasons/active");
}
