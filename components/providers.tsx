"use client";

import { TRPCProvider } from "@/lib/trpc/client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <NuqsAdapter>
        {children}
        <Toaster position="top-right" richColors />
      </NuqsAdapter>
    </TRPCProvider>
  );
}
