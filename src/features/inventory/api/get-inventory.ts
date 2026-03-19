import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "../types";

export const useGetInventory = (searchQuery?: string) => {
  return useQuery<Product[]>({
    // Important: Include searchQuery in the key so it refetches when you type
    queryKey: ["inventory", searchQuery], 
    queryFn: async () => {
      const response = await axios.get("/api/inventory", {
        params: { q: searchQuery } // Axios adds the ?q= automatically
      });
      return response.data;
    },
  });
};