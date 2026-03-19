import { useGetInventory } from "@/features/inventory/api/get-inventory";

export function useInventoryStats() {
  const { data: products = [] } = useGetInventory();

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalItems = products.length;

  return {
    totalValue,
    lowStockCount,
    outOfStockCount,
    totalItems,
  };
}