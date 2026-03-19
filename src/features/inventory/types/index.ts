export type ProductStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type WarehouseLocation =
  | "Warehouse A"
  | "Warehouse B"
  | "Distribution Center";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: ProductStatus;
  warehouse: WarehouseLocation; // Multi-warehouse support
  taxRate: number;
}
