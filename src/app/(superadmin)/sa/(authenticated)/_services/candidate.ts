"use client";

import { useHttp, useHttpMutation } from "@dhoniaridho/react-ohttp";
import { CandidateResponse, CandidateResponseList } from "../_models/response/candidate";

export const useGetCandidates = (params: Record<string, string>) => {
    return useHttp<CandidateResponseList>("/superadmin/candidates", {
        searchParams: params,
    });
};

export const useCreateCandidate = () => {
    return useHttpMutation<CandidateResponse>(
        "/superadmin/candidates",
        {
            method: "POST",
        }
        );
};

export const useDeleteCandidate = () => {
    return useHttpMutation<CandidateResponse>(
        `/superadmin/candidates/{id}`,
        {
            method: "DELETE",
        }
        );
};

export const useUpdateCandidate = () => {
    return useHttpMutation<CandidateResponse>(
        `/superadmin/candidates/{id}`,
        {
            method: "PUT",
        }
        );
};

export const useGetCandidateById = (id: string) => {
    return useHttp<CandidateResponse>(`/superadmin/candidates/${id}`);
};
