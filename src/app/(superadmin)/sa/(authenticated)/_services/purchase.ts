"use client";

import { useHttp } from "react-ohttp";
import { PurchaseResponseList } from "../_models/response/purchase";

export const useGetPurchase = (params?: Record<string, string>) => {
  return useHttp<PurchaseResponseList>("/superadmin/purchases", {
    searchParams: params,
  });
};