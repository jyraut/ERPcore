"use client";

import * as z from "zod";
import axios from "axios";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define Schema - Single Source of Truth
const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  sku: z.string().min(3, "Unique SKU is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
});

// 2. Infer types directly from Schema
type FormValues = z.infer<typeof formSchema>;

interface AddProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductSheet({ open, onOpenChange }: AddProductSheetProps) {
  const queryClient = useQueryClient();

  // 3. Initialize Form with Inferred Types
  const form = useForm<FormValues>({
    // We cast to Resolver<FormValues> to force the Input/Output types to align
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      stock: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      // Logic: Enhance data before sending to MSW
      const payload = {
        ...values,
        category: "General", // Default category for new assets
        status: values.stock > 0 ? "In Stock" : "Out of Stock",
      };
      return axios.post("/api/inventory", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Asset added to warehouse records");
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error("Failed to add asset. Connection error.");
    },
  });

  // 4. Strict Submit Handler
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 border-b border-slate-100 dark:border-slate-900">
            <SheetTitle className="text-2xl font-black tracking-tight">
              Add New Asset
            </SheetTitle>
            <SheetDescription>
              Register a new item into the central inventory.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8">
            <Form {...form}>
              <form
                id="add-product-form"
                onSubmit={form.handleSubmit(onSubmit as any)}
                className="space-y-6"
              >
                <FormField
                  control={form.control as any}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Industrial Turbine"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control as any}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">SKU ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="SKU-000"
                            className="rounded-xl font-mono text-xs uppercase"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">
                          Initial Stock
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="rounded-xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control as any}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">
                        Unit Price ($)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          <SheetFooter className="p-8 border-t border-slate-100 dark:border-slate-900">
            <Button
              type="submit"
              form="add-product-form"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Processing..." : "Confirm & Save Asset"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
