"use client";

import { useHttp, useHttpMutation } from "react-ohttp";
import { SeriesResponse, SeriesResponseList } from "../_models/response/series";

export const useGetSeries = (params?: Record<string, string>) => {
  return useHttp<SeriesResponseList>("/superadmin/series", {
    searchParams: params,
  });
};

export const useCreateSeries = () => {
  return useHttpMutation<SeriesResponse>("/superadmin/series", {
    method: "POST",
  });
};

export const useDeleteSeries = () => {
  return useHttpMutation<SeriesResponse>(`/superadmin/series/{id}`, {
    method: "DELETE",
  });
};

export const useUpdateSeries = () => {
  return useHttpMutation<SeriesResponse>(`/superadmin/series/{id}`, {
    method: "PUT",
  });
};

export const useGetSeriesById = (id: string) => {
  return useHttp<SeriesResponse>(`/superadmin/series/${id}`);
};
