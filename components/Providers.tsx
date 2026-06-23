"use client";

import React from "react";
import { Toaster } from "sonner";
import Chatbot from "./Chatbot";
import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {children}
      {!isDashboard && <Chatbot />}
      <Toaster position="top-right" richColors />
    </>
  );
}
