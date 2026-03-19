"use client";

import { Plus, Package, Users, Receipt } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "./permission-gate";
import { AddProductSheet } from "@/features/inventory/components/add-product-sheet";
import { useState } from "react";

export function QuickActions() {
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Plus className="h-7 w-7 transition-transform group-hover:rotate-90" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          side="top" 
          align="end" 
          sideOffset={12}
          className="w-56 rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-2xl"
        >
          <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 p-3">
            Quick Operations
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />
          
          <PermissionGate allowedRoles={["ADMIN", "MANAGER"]}>
            <DropdownMenuItem onSelect={() => setIsAddProductOpen(true)} className="flex items-center gap-3 p-3 rounded-xl focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer">
              <Package className="h-4 w-4" />
              <span className="font-semibold text-sm">Add New Product</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:text-blue-600 dark:focus:text-blue-400 cursor-pointer">
              <Users className="h-4 w-4" />
              <span className="font-semibold text-sm">Onboard Employee</span>
            </DropdownMenuItem>
          </PermissionGate>

          <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl focus:bg-slate-100 dark:focus:bg-slate-800 cursor-pointer">
            <Receipt className="h-4 w-4" />
            <span className="font-semibold text-sm">Create Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddProductSheet open={isAddProductOpen} onOpenChange={setIsAddProductOpen} />
    </div>
  );
}