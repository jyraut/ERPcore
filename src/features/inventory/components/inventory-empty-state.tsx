"use client";

import { SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

export function InventoryEmptyState({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    router.replace(pathname);
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
        <SearchX className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        No assets found
      </h3>
      <p className="text-slate-500 max-w-[250px] mt-2">
        We couldn't find anything matching{" "}
        <span className="font-bold text-blue-600">"{query}"</span>. Try a
        different SKU or name.
      </p>
      <Button
        variant="link"
        onClick={handleClear}
        className="mt-4 text-blue-600 font-bold flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Clear all filters
      </Button>
    </div>
  );
}
