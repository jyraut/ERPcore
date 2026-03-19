"use client";

import { useGetEmployees } from "@/features/employees/api/use-get-employees";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RevenueChart } from "@/features/finance/components/revenue-chart";
import { Activity, AlertTriangle, Users, Wallet } from "lucide-react";
import { useGetInventory } from "@/features/inventory/api/get-inventory";
import { AuditLog } from "@/features/audit/types";
import { AuditTimeline } from "@/features/audit/components/audit-timeline";
import { Product } from "@/features/inventory/types";

export default function DashboardPage() {
  const { data: inventory = [] } = useGetInventory();
  const { data: employees = [] } = useGetEmployees();
  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: () =>
      axios.get("/api/finance/transactions").then((res) => res.data),
  });

  const { data: logs = [] } = useQuery<AuditLog[]>({
    queryKey: ["audit-logs"],
    queryFn: () => axios.get("/api/audit-logs").then((res) => res.data),
  });

  // BI Calculations
  const lowStockCount = inventory.filter((item) => item.stock < 10).length;
  //   const totalAssetValue = inventory.reduce(
  //     (acc, item) => acc + item.price * item.stock,
  //     0,
  //   );
  const monthlyPayroll = employees.length * 4500; // Estimated avg salary
  const cashLiquidity = transactions.reduce(
    (acc: number, t: any) =>
      t.type === "INCOME" ? acc + t.amount : acc - t.amount,
    0,
  );

  // Calculate total tax based on current inventory value
  const totalTaxLiability = inventory.reduce((acc: number, item: Product) => {
    const itemValue = item.price * item.stock;
    return acc + itemValue * item.taxRate;
  }, 0);

  // Updated Asset Valuation (Post-Tax or Pre-Tax toggle)
  const totalAssetValue = inventory.reduce(
    (acc: number, item: Product) => acc + item.price * item.stock,
    0,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          Executive Command
        </h1>
        <p className="text-slate-500 font-medium">
          Cross-module operational health and liquidity.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Cash Liquidity"
          value={`$${cashLiquidity.toLocaleString()}`}
          icon={Wallet}
          trend="+12% vs last month"
          color="text-emerald-600"
        />
        <KPICard
          label="Asset Valuation"
          value={`$${totalAssetValue.toLocaleString()}`}
          icon={Activity}
          trend="Inventory value"
          color="text-blue-600"
        />
        <KPICard
          label="Est. Monthly Burn"
          value={`$${monthlyPayroll.toLocaleString()}`}
          icon={Users}
          trend="Payroll & Ops"
          color="text-rose-600"
        />
        <KPICard
          label="Critical Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          trend="Stock below threshold"
          color="text-amber-600"
          isAlert={lowStockCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Analytics */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <h3 className="text-lg font-black mb-6">System Audit Trail</h3>
          <AuditTimeline logs={logs} />
        </div>
        {/* Recent Activity Mini-Ledger */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold mb-4">Recent Personnel</h3>
          <div className="space-y-4">
            {employees.slice(0, 5).map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{emp.name}</p>
                  <p className="text-xs text-slate-500">
                    {emp.role} • {emp.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, icon: Icon, trend, color, isAlert }: any) {
  return (
    <div
      className={`p-6 bg-white dark:bg-slate-900 border ${isAlert ? "border-amber-200 bg-amber-50/20" : "border-slate-200 dark:border-slate-800"} rounded-2xl`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h2 className="text-3xl font-black tracking-tight mt-1">{value}</h2>
      <p className="text-xs font-bold mt-2 text-slate-400 uppercase tracking-wider">
        {trend}
      </p>
    </div>
  );
}
