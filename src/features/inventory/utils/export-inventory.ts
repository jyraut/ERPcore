import { Product } from "../types";

export const exportInventoryToCSV = (data: Product[]) => {
  // 1. Define Headers
  const headers = [
    "SKU",
    "Product Name",
    "Warehouse",
    "Category",
    "Stock Level",
    "Price",
    "Status",
    "Last Updated",
  ];

  // 2. Map data to rows
  const rows = data.map((item) => [
    item.sku,
    `"${item.name}"`, // Wrap names in quotes to handle commas in product titles
    item.warehouse,
    item.category,
    item.stock,
    item.price,
    item.status,
    `$${item.price}`,
    `${item.taxRate * 100}%`, // Displays as "12%"
    `$${(item.price * item.stock * item.taxRate).toFixed(2)}`,
  ]);

  // 3. Construct CSV String
  const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");

  // 4. Trigger Download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `inventory_report_${new Date().toISOString().split("T")[0]}.csv`,
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
