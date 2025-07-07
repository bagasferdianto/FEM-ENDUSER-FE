"use-client";

import { useHttp, useHttpMutation } from "@dhoniaridho/react-ohttp";
import { VenueResponse, VenueResponseList } from "../_models/response/venue";

export const useGetVenues = (params: Record<string, string>) => {
  return useHttp<VenueResponseList>("/superadmin/venues", {
    searchParams: params,
  });
};

export const useCreateVenue = () => {
  return useHttpMutation<VenueResponse>(
    "/superadmin/venues",
    {
      method: "POST",
    }
  );
}

export const useDeleteVenue = () => {
  return useHttpMutation<VenueResponse>(
    `/superadmin/venues/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetVenueById = (id: string) => {
  return useHttp<VenueResponse>(`/superadmin/venues/${id}`);
};

export const useUpdateVenue = () => {
  return useHttpMutation<VenueResponse>(
    `/superadmin/venues/{id}`,
    {
      method: "PUT",
    }
  );
};
