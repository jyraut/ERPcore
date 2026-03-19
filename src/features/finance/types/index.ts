export interface Transaction {
  id: string;
  date: string;
  category: "Inventory" | "Payroll" | "Sales" | "Operations";
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}