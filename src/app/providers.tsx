"use client";

import React from "react";
import { HttpProvider, QueryClient } from "react-ohttp";
import Cookies from "js-cookie";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HttpProvider
      client={queryClient}
      baseURL={process.env.NEXT_PUBLIC_API_URL}
      beforeRequest={(c) => {
        const token = Cookies.get("auth_token");
        if (token) {
          c.headers.Authorization = `Bearer ${token}`;
        }
        return c;
      }}
      onFulfill={(res) => {
        console.log(res, "success");
        return res;
      }}
      onReject={(e) => {
        if (e.status === 401) {
          Cookies.remove("auth_token");
          location.href = "/login";
        }
        return e;
      }}
    >
      <>{children}</>
    </HttpProvider>
  );
}
