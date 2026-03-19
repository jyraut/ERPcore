import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "../types";

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStock }: { id: string; newStock: number }) => {
      const { data } = await axios.patch(`/api/inventory/${id}`, { newStock });
      return data;
    },
    // Step 1: When mutate is called
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["inventory"] });

      // Snapshot the previous value
      const previousInventory = queryClient.getQueryData<Product[]>(["inventory"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Product[]>(["inventory"], (old) =>
        old?.map((p) =>
          p.id === variables.id ? { ...p, stock: variables.newStock } : p
        )
      );

      // Return a context object with the snapshotted value
      return { previousInventory };
    },
    // Step 2: If the mutation fails, use the context we returned above
    onError: (err, variables, context) => {
      queryClient.setQueryData(["inventory"], context?.previousInventory);
    },
    // Step 3: Always refetch after error or success to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
};