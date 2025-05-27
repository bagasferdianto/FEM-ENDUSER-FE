"use client";

import { startTransition, useState } from "react";
import { HttpProvider, QueryClient } from "react-ohttp";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [show401, setShow401] = useState(false);
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
        return res;
      }}
      onReject={(e) => {
        if (e.status === 401 && !show401) {
          startTransition(() => {
            setShow401(true);
          });
          toast.error("Sesi anda telah habis silahkan login kembali.");
          Cookies.remove("auth_token");

          const currentPath = window.location.pathname;
          if (currentPath.startsWith("/sa")) {
            location.href = "/sa/signin";
          } else {
            location.href = "/login";
          }
        }
        throw e;
      }}
    >
      <ProgressProvider
        height="4px"
        color="#00009C"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </HttpProvider>
  );
}
