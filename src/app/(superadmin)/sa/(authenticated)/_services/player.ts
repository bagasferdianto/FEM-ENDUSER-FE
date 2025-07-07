"use-client";

import { useHttp, useHttpMutation } from "@dhoniaridho/react-ohttp";
import { PlayerResponse, PlayerResponseList } from "../_models/response/player";

export const useGetPlayers = (params: Record<string, string>) => {
  return useHttp<PlayerResponseList>("/superadmin/players", {
    searchParams: params,
  });
};

export const useCreatePlayer = () => {
  return useHttpMutation<PlayerResponse>(
    "/superadmin/players",
    {
      method: "POST",
    }
  );
}

export const useDeletePlayer = () => {
  return useHttpMutation<PlayerResponse>(
    `/superadmin/players/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetPlayerById = (id: string) => {
  return useHttp<PlayerResponse>(`/superadmin/players/${id}`);
};

export const useUpdatePlayer = () => {
  return useHttpMutation<PlayerResponse>(
    `/superadmin/players/{id}`,
    {
      method: "PUT",
    }
  );
};
