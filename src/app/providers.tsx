"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { HttpProvider, QueryClient } from "react-ohttp";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import { handleUnauthorizedRedirect } from "@/lib/auth-redirect";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [show401, setShow401] = useState(false);
  const hasShown401Toast = useRef(false);

  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => {
    if (window.location.pathname.includes("sa")) {
      setColor("#00009C");
    }
  }, []);
  
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
        if (e.status === 401 && !hasShown401Toast.current && !show401) {
          hasShown401Toast.current = true;
          startTransition(() => {
            setShow401(true);
          });
          toast.error("Sesi anda telah habis silahkan login kembali.");
          
          // handle redirect
          const currentPath = window.location.pathname;
          handleUnauthorizedRedirect(currentPath);
        }
        throw e;
      }}
    >
      <ProgressProvider
        height="4px"
        color={color}
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </HttpProvider>
  );
}
