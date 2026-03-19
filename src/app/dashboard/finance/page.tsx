"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";
import { Transaction } from "@/features/finance/types";
import { RevenueChart } from "@/features/finance/components/revenue-chart";
import { Download, FileSpreadsheet, Printer } from "lucide-react";
import { exportTransactionsToCSV } from "@/features/finance/utils/export-utils";
import { Button } from "@/components/ui/button";
import { FinanceTableSkeleton } from "@/features/finance/components/finance-skeleton";

export default function FinancePage() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: () => axios.get("/api/finance/transactions").then(res => res.data)
  });

  const handlePrint = () => {
    window.print(); // Triggers the browser print dialog
  };

  const income =
    transactions
      ?.filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + t.amount, 0) || 0;
  const expenses =
    transactions
      ?.filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + t.amount, 0) || 0;
  const balance = income - expenses;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          Financial Overview
        </h1>
        <p className="text-slate-500">
          Real-time cash flow and asset valuation.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-xl font-bold border-slate-200"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" /> Print PDF
        </Button>
        <Button
          className="rounded-xl bg-blue-600 font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          // Use ?? [] to handle the undefined state
          onClick={() => exportTransactionsToCSV(transactions ?? [])}
          disabled={!transactions || transactions.length === 0} // Optional: Disable if no data
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceStatCard
          label="Total Balance"
          value={balance}
          icon={Wallet}
          color="text-blue-600"
        />
        <FinanceStatCard
          label="Monthly Income"
          value={income}
          icon={TrendingUp}
          color="text-emerald-600"
        />
        <FinanceStatCard
          label="Monthly Expenses"
          value={expenses}
          icon={TrendingDown}
          color="text-rose-600"
        />
      </div>
      {/* Data Visualization Row */}
      <div className="grid grid-cols-1 gap-6">
        <RevenueChart />
      </div>
      {/* Transaction Ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold">Recent Transactions</h3>
          <button className="text-sm text-blue-600 font-bold flex items-center gap-1">
            View Statement <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
        {isLoading ? (
          <FinanceTableSkeleton />
        ) : (
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions?.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {t.description}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{t.category}</td>
                <td
                  className={`px-6 py-4 text-right font-bold ${t.type === "INCOME" ? "text-emerald-600" : "text-slate-900 dark:text-white"}`}
                >
                  {t.type === "INCOME" ? "+" : "-"}${t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

function FinanceStatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
      </div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h2 className="text-3xl font-black tracking-tight mt-1">
        ${value.toLocaleString()}
      </h2>
    </div>
  );
}
