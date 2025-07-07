import { useHttp } from "@dhoniaridho/react-ohttp";
import { DashboardResponse } from "../_models/response/dashboard";

export const useGetDashboard = (params: Record<string, string>) => {
  return useHttp<DashboardResponse>("/superadmin/dashboard", {
    searchParams: params,
  });
};