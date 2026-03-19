"use client";

import { Download, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce"; // We'll create this next
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/shared/permission-gate";
import { exportInventoryToCSV } from "../utils/export-inventory";
import { useGetInventory } from "../api/get-inventory";

export function InventoryHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: inventory = [] } = useGetInventory();
  // Local state for the input to keep typing feeling instant
  const [value, setValue] = useState(searchParams.get("q") || "");
  const debouncedValue = useDebounce(value, 300);

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get("q");
    if (debouncedValue !== current) {
      if (debouncedValue) {
        params.set("q", debouncedValue);
      } else {
        params.delete("q");
      }
      // Use 'replace' instead of 'push' to keep the history clean
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedValue, pathname, router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Inventory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage assets and real-time stock levels.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => exportInventoryToCSV(inventory)}
            variant="outline"
            className="rounded-xl font-bold dark:border-slate-800"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <PermissionGate allowedRoles={["ADMIN", "MANAGER"]}>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
              Add Product
            </Button>
          </PermissionGate>
        </div>
      </div>

      <div className="relative w-full sm:w-96 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Search by SKU or Product Name..."
          className="pl-10 pr-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus-visible:ring-blue-500 transition-all"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-3 w-3 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}
