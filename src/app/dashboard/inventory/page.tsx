"use client";

import { useGetInventory } from "@/features/inventory/api/get-inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUpdateStock } from "@/features/inventory/api/use-update-stock";
import {
  Plus,
  Minus,
  PackageSearch,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PermissionGate } from "@/components/shared/permission-gate";
import { cn } from "@/lib/utils";

import { Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import { InventoryHeader } from "@/features/inventory/components/inventory-header";
import { InventoryEmptyState } from "@/features/inventory/components/inventory-empty-state";
import { InventoryStats } from "@/features/inventory/components/inventory-stats";
import { useState } from "react";
import { exportInventoryToCSV } from "@/features/inventory/utils/export-inventory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // One single, clean data source
  const { data: products, isLoading } = useGetInventory(query);
  const updateStock = useUpdateStock();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("ALL");

  const filteredInventory =
    products?.filter(
      (item) =>
        selectedWarehouse === "ALL" || item.warehouse === selectedWarehouse,
    ) || [];

  // 3. Export uses the filtered list
  const handleExport = () => exportInventoryToCSV(filteredInventory);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <PackageSearch className="h-10 w-10 text-slate-300" />
          <p className="text-slate-400 font-medium tracking-tight">
            Syncing inventory...
          </p>
        </div>
      </div>
    );

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 animate-pulse">Loading workspace...</p>
      </div>
    }>
       <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <InventoryHeader />
      <InventoryStats />
      {/* Modern Table Layout */}
      <div className="hidden md:flex rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden min-h-[400px] flex-col">
        {" "}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-500 animate-pulse font-medium">
              Scanning warehouse records...
            </p>
          </div>
        ) : filteredInventory?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <InventoryEmptyState query={query} />
          </div>
        ) : (
          <div className="p-6">
            {/* Header Section with Warehouse Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Inventory Management
                </h1>
                <p className="text-sm text-slate-500">
                  Track stock and tax liability across locations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger className="w-[200px] rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Warehouses</SelectItem>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Distribution Center">
                      Distribution Center
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                  <TableRow className="hover:bg-transparent border-b border-slate-200/60 dark:border-slate-800">
                    <TableHead className="w-[120px] font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-6">
                      SKU
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200 py-5">
                      Product Name
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200">
                      Location
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200">
                      Stock Management
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-right">
                      Tax Rate
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-right">
                      Unit Price
                    </TableHead>
                    <TableHead className="font-bold text-slate-900 dark:text-slate-200 text-right pr-6">
                      Total (Inc. Tax)
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((product) => (
                    <TableRow
                      key={product.id}
                      className="group border-slate-100 dark:border-slate-900 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200"
                    >
                      <TableCell className="pl-6 font-mono text-[11px] text-slate-400">
                        {product.sku}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                            {product.category || "General"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-lg bg-blue-50/50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-none font-bold"
                        >
                          {product.warehouse}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <PermissionGate allowedRoles={["ADMIN", "MANAGER"]}>
                            <button
                              className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                              onClick={() =>
                                updateStock.mutate({
                                  id: product.id,
                                  newStock: product.stock - 1,
                                })
                              }
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                          </PermissionGate>

                          <span
                            className={cn(
                              "min-w-[40px] text-center font-black text-lg",
                              product.stock <= 5
                                ? "text-red-500"
                                : "text-slate-900 dark:text-white",
                            )}
                          >
                            {product.stock}
                          </span>

                          <PermissionGate allowedRoles={["ADMIN", "MANAGER"]}>
                            <button
                              className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                              onClick={() =>
                                updateStock.mutate({
                                  id: product.id,
                                  newStock: product.stock + 1,
                                })
                              }
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </PermissionGate>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-500 font-medium">
                        {product.taxRate * 100}%
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900 dark:text-slate-300">
                        $
                        {product.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right font-black text-emerald-600 dark:text-emerald-400 pr-6">
                        $
                        {(
                          product.price *
                          product.stock *
                          (1 + product.taxRate)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
      {/* Mobile Grid View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredInventory.map((product) => (
          <div
            key={product.id}
            className="p-5 border border-slate-200/60 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Inventory Management
                </h1>
                <p className="text-sm text-slate-500">
                  Track stock and tax liability across locations
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Select
                  value={selectedWarehouse}
                  onValueChange={setSelectedWarehouse}
                >
                  <SelectTrigger className="w-[200px] rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="ALL">All Warehouses</SelectItem>
                    <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                    <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    <SelectItem value="Distribution Center">
                      Distribution Center
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {product.sku}
                </p>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {product.name}
                </h3>
                {/* Added Warehouse Tag for Mobile */}
                <Badge
                  variant="secondary"
                  className="mt-1 text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                >
                  {product.warehouse}
                </Badge>
              </div>
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 border-none font-black text-[9px] uppercase tracking-widest",
                  product.status === "In Stock"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-red-500/10 text-red-600",
                )}
              >
                {product.status}
              </Badge>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-900">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">
                  Unit Price + Tax ({product.taxRate * 100}%)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${(product.price * (1 + product.taxRate)).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="text-sm font-medium text-slate-500">
                  Stock:{" "}
                  <span className="text-slate-900 dark:text-white font-bold">
                    {product.stock}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">
                    Total Value
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black">
                    $
                    {(
                      product.price *
                      product.stock *
                      (1 + product.taxRate)
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Suspense>
   
  );
}

// Add this component inside your file or as a separate component
export function DeleteProductAction({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => axios.delete(`/api/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success(`${name} removed from inventory`);
    },
    onError: () => toast.error("Failed to delete item"),
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="dark:bg-slate-950">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove <strong>{name}</strong> from the
            warehouse records. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Asset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
