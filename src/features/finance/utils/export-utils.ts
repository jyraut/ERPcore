import { Transaction } from "../types";

export const exportTransactionsToCSV = (transactions: Transaction[]) => {
  const headers = ["Date,Description,Category,Type,Amount"];
  const rows = transactions.map(
    (t) => `${t.date},${t.description},${t.category},${t.type},${t.amount}`
  );

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ERP_Finance_Report_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};