"use client";

import { useHttp } from "react-ohttp";
import { SeriesResponse, SeriesResponseList } from "../_models/response/series";

export const useGetSeries = (params?: Record<string, string>) => {
  return useHttp<SeriesResponseList>("/member/series", {
    searchParams: params,
  });
};

export const useGetSeriesWithTickets = (params?: Record<string, string>) => {
  return useHttp<SeriesResponseList>("/member/series/with-tickets", {
    searchParams: params,
  });
};

export const useGetSeriesById = (id: string) => {
  return useHttp<SeriesResponse>(`/member/series/${id}`);
};
