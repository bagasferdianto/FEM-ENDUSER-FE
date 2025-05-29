"use-client";

import { useHttp, useHttpMutation } from "react-ohttp";
import { TeamResponse, TeamResponseList } from "../_models/response/team";

export const useGetTeams = (params: Record<string, string>) => {
  return useHttp<TeamResponseList>("/superadmin/teams", {
    searchParams: params,
  });
};

export const useCreateTeam = () => {
  return useHttpMutation<TeamResponse>(
    "/superadmin/teams",
    {
      method: "POST",
    }
  );
}

export const useDeleteTeam = () => {
  return useHttpMutation<TeamResponse>(
    `/superadmin/teams/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetTeamById = (id: string) => {
  return useHttp<TeamResponse>(`/superadmin/teams/${id}`);
};

export const useUpdateTeam = () => {
  return useHttpMutation<TeamResponse>(
    `/superadmin/teams/{id}`,
    {
      method: "PUT",
    }
  );
};
