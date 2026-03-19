"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const employeeSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MANAGER", "VIEWER"]),
  department: z.string().min(2, "Department is required"),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export function AddEmployeeSheet({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void 
}) {
  const queryClient = useQueryClient();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      role: "VIEWER",
      department: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: EmployeeFormValues) => axios.post("/api/employees", {
      ...values,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("New team member onboarded successfully");
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error("Failed to add employee"),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg border-l border-slate-200 dark:border-slate-800 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-8 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50">
            <SheetTitle className="text-2xl font-black">Onboard Employee</SheetTitle>
            <SheetDescription>Assign a role and department to the new member.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-8">
            <Form {...form}>
              <form id="add-employee-form" onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Work Email</FormLabel>
                      <FormControl><Input type="email" placeholder="john@erpcore.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">System Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                            <SelectItem value="MANAGER">Manager</SelectItem>
                            <SelectItem value="VIEWER">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Department</FormLabel>
                        <FormControl><Input placeholder="Engineering" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>

          <SheetFooter className="p-8 border-t border-slate-100 dark:border-slate-900">
            <Button 
              type="submit" 
              form="add-employee-form" 
              className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Syncing..." : "Confirm Onboarding"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}