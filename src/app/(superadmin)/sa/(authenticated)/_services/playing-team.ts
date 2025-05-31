"use-client";

import { useHttp, useHttpMutation } from "react-ohttp";
import { PlayingTeamResponse, PlayingTeamResponseList } from "../_models/response/playing-team";

export const useGetPlayingTeams = (params: Record<string, string>) => {
  return useHttp<PlayingTeamResponseList>("/superadmin/season-teams", {
    searchParams: params,
  });
};

export const useCreatePlayingTeam = () => {
  return useHttpMutation<PlayingTeamResponse>(
    "/superadmin/season-teams",
    {
      method: "POST",
    }
  );
}

export const useManagePlayingTeam = () => {
  return useHttpMutation<PlayingTeamResponse>(
    `/superadmin/season-teams/manage`,
    {
      method: "POST",
    }
  );
}

export const useDeletePlayingTeam = () => {
  return useHttpMutation<PlayingTeamResponse>(
    `/superadmin/season-teams/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetPlayingTeamById = (id: string) => {
  return useHttp<PlayingTeamResponse>(`/superadmin/season-teams/${id}`);
};
