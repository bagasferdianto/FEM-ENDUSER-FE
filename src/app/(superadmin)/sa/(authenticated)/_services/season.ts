"use-client";

import { useHttp, useHttpMutation } from "@dhoniaridho/react-ohttp";
import { SeasonResponse, SeasonResponseList } from "../_models/response/season";

export const useGetSeasons = (params: Record<string, string>) => {
  return useHttp<SeasonResponseList>("/superadmin/seasons", {
    searchParams: params,
  });
};

export const useGetActiveSeason = () => {
  return useHttp<SeasonResponse>("/superadmin/seasons/active");
}

export const useUpdateStatusSeason = () => {
  return useHttpMutation<SeasonResponse>(
    `/superadmin/seasons/{id}/status`,
    {
      method: "PUT",
    }
  );
};

export const useCreateSeason = () => {
  return useHttpMutation<SeasonResponse>(
    "/superadmin/seasons",
    {
      method: "POST",
    }
  );
}

export const useDeleteSeason = () => {
  return useHttpMutation<SeasonResponse>(
    `/superadmin/seasons/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetSeasonById = (id: string) => {
  return useHttp<SeasonResponse>(`/superadmin/seasons/${id}`);
};

export const useUpdateSeason = () => {
  return useHttpMutation<SeasonResponse>(
    `/superadmin/seasons/{id}`,
    {
      method: "PUT",
    }
  );
};
