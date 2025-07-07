"use client";

import { useHttp } from "@dhoniaridho/react-ohttp";
import { TicketPurchaseResponseList } from "../_models/response/ticket-purchase";

export const useGetTicketPurchases = (params?: Record<string, string>) => {
  return useHttp<TicketPurchaseResponseList>("/member/ticket-purchases", {
    searchParams: params,
  });
};