"use-client";

import { useHttp, useHttpMutation } from "react-ohttp";
import { PlayerPositionResponse, PlayingPlayerResponse, PlayingPlayerResponseList } from "../_models/response/playing-player";

export const useGetPlayingPlayers = (params: Record<string, string>) => {
  return useHttp<PlayingPlayerResponseList>("/superadmin/season-team-players", {
    searchParams: params,
  });
};

export const useCreatePlayingPlayer = () => {
  return useHttpMutation<PlayingPlayerResponse>(
    "/superadmin/season-team-players",
    {
      method: "POST",
    }
  );
}

export const useUpdatePlayingPlayer = () => {
  return useHttpMutation<PlayingPlayerResponse>(
    `/superadmin/season-team-players/{id}`,
    {
      method: "PUT",
    }
  );
}

export const useDeletePlayingPlayer = () => {
  return useHttpMutation<PlayingPlayerResponse>(
    `/superadmin/season-team-players/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetPlayingPlayerById = (id: string) => {
  return useHttp<PlayingPlayerResponse>(`/superadmin/season-team-players/${id}`);
};

export const useGetPlayerPositions = (params: Record<string, string>) => {
  return useHttp<PlayerPositionResponse>("/superadmin/season-team-players/position-list", {
    searchParams: params,
  });
}
