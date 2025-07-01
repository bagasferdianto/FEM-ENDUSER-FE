"use client";

import { useHttp } from "react-ohttp";
import { VotingResponse, VotingResponseList } from "../_models/response/voting";

export const useGetVoting = (params?: Record<string, string>) => {
  return useHttp<VotingResponseList>("/member/votings", {
    searchParams: params,
  });
};

export const useGetVotingById = (id: string) => {
  return useHttp<VotingResponse>(`/member/votings/${id}`);
};