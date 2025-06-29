"use client";

import { useHttp } from "react-ohttp";
import { TicketResponse } from "../_models/response/ticket";

export const useGetTicketById = (id: string) => {
  return useHttp<TicketResponse>(`/member/tickets/${id}`);
};