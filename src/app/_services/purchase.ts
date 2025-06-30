"use client";

import { useHttp } from "react-ohttp";
import { PurchaseResponse, PurchaseResponseList } from "../_models/response/purchase";

export const useGetPurchases = (params?: Record<string, string>) => {
  return useHttp<PurchaseResponseList>("/member/purchases", {
    searchParams: params,
  });
};

export const useGetPurchaseById = (id: string) => {
  return useHttp<PurchaseResponse>(`/member/purchases/${id}`);
};