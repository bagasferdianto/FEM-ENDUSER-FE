"use-client";

import { useHttp, useHttpMutation } from "react-ohttp";
import { TicketResponse, TicketResponseList } from "../_models/response/ticket";

export const useGetTickets = (params: Record<string, string>) => {
  return useHttp<TicketResponseList>("/superadmin/tickets", {
    searchParams: params,
  });
};

export const useCreateorUpdateTicket = () => {
  return useHttpMutation<TicketResponse>(
    "/superadmin/tickets",
    {
      method: "POST",
    }
  );
}

export const useDeleteTicket = () => {
  return useHttpMutation<TicketResponse>(
    `/superadmin/tickets/{id}`,
    {
      method: "DELETE",
    }
  );
}

export const useGetTicketById = (id: string) => {
  return useHttp<TicketResponse>(`/superadmin/tickets/${id}`);
};
