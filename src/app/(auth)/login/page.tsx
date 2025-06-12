"use client";

import { Suspense } from "react";
import Login from "./_components/log-in";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-pfl mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat...</p>
          </div>
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}
