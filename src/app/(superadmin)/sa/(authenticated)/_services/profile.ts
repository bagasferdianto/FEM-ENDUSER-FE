"use-client";
import { useHttp } from "react-ohttp";
import { ProfileResponse } from "../_models/response/profile";

export const useGetProfile = () => {
  const { data, error, isLoading } = useHttp<ProfileResponse>(
    "/superadmin/auth/profile"
  );

  return {
    data,
    error,
    isLoading,
  };
};
