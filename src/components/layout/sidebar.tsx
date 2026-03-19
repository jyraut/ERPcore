"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  CreditCard,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
      {" "}
      {/* Logo Section with Gradient */}
      <div className="p-8 print:hidden">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <span className="text-white font-black text-xs">EC</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            ERP<span className="text-blue-600">Core</span>
          </h1>
        </div>
      </div>
      {/* Navigation Group */}
      <nav className="flex-1 px-4 space-y-1.5">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Main Menu
        </p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50 dark:bg-blue-900/20 dark:text-blue-400 dark:shadow-none"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/50 dark:hover:text-slate-100",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                  )}
                />
                {item.name}
              </div>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
      {/* Refined Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center border border-white shadow-sm">
              <span className="text-slate-600 font-bold text-xs">SD</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Senior Dev</p>
              <p className="text-[11px] text-slate-500">System Admin</p>
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
