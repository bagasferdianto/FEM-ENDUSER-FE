"use client";

import { useHttp } from "react-ohttp";
import { PurchaseResponse } from "../_models/response/purchase";

export const useGetPurchaseById = (id: string) => {
  return useHttp<PurchaseResponse>(`/member/purchases/${id}`);
};