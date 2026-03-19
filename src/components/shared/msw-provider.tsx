"use client";
import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
        setReady(true);
      }
    };
    init();
  }, []);

  if (!ready && process.env.NODE_ENV === "development") return null;
  return <>{children}</>;
}