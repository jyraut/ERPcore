"use client";
import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined") {
        try {
          const { worker } = await import("@/mocks/browser");
          await worker.start({ 
            onUnhandledRequest: "bypass",
            serviceWorker: {
              url: "/mockServiceWorker.js", 
            }
          });
          setReady(true);
        } catch (error) {
          console.error("MSW failed to start:", error);
          setReady(true); 
        }
      }
    };
    init();
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            Initializing Core Systems...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}