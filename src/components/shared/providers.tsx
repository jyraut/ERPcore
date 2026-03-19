"use client";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MSWProvider } from "./msw-provider"; // Ensure this path is correct
import { Toaster } from "../ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  // We use useState to ensure QueryClient is only created once per session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <MSWProvider>
          {children}
          <Toaster position="top-right" richColors />
        </MSWProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
