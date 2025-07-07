"use client";

import { useHttp, useHttpMutation } from "@dhoniaridho/react-ohttp";
import { VotingResponse, VotingResponseList } from "../_models/response/voting";

export const useGetVotings = (params: Record<string, string>) => {
    return useHttp<VotingResponseList>("/superadmin/votings", {
        searchParams: params,
    });
};



export const useCreateVoting = () => {
    return useHttpMutation<VotingResponse>(
        "/superadmin/votings",
        {
            method: "POST",
        }
    );
};

export const useDeleteVoting = () => {
    return useHttpMutation<VotingResponse>(
        `/superadmin/votings/{id}`,
        {
            method: "DELETE",
        }
    );
};

export const useUpdateVoting = () => {
    return useHttpMutation<VotingResponse>(
        `/superadmin/votings/{id}`,
        {
            method: "PUT",
        }
    );
};

export const useGetVotingById = (id: string) => {
    return useHttp<VotingResponse>(`/superadmin/votings/${id}`);
};
