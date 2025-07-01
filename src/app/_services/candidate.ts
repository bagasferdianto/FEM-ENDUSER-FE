"use client";

import { useHttp, useHttpMutation } from "react-ohttp";
import {
  CandidateResponse,
  CandidateResponseList,
} from "../_models/response/candidate";

export const useGetCandidate = (params?: Record<string, string>) => {
  return useHttp<CandidateResponseList>("/member/candidates", {
    searchParams: params,
  });
};

export const useVoteCandidate = () => {
  return useHttpMutation<CandidateResponse>("/member/candidates/vote", {
    method: "POST",
  });
};
