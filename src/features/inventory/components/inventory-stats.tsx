"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useInventoryStats } from "@/hooks/use-inventory-stats";
import { Package, AlertTriangle, XCircle, DollarSign } from "lucide-react";

export function InventoryStats() {
  const stats = useInventoryStats();

  const items = [
    {
      label: "Total Inventory Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Low Stock Assets",
      value: stats.lowStockCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStockCount,
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-500/10",
    },
    {
      label: "Total Unique SKUs",
      value: stats.totalItems,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}