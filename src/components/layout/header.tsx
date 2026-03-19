"use client";

import { Menu, Bell, UserCircle, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useAuthStore } from "@/store/use-auth-store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export function Header() {
  const { user, setRole } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 lg:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-50"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Breadcrumb / Search Placeholder for Modern Look */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400">
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline text-slate-400/70">
            Search records, files...
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        {/* Professional Role Switcher */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/50">
          {(["VIEWER", "MANAGER", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setRole(role)}
              className={cn(
                "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                user?.role === role
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 lg:gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-slate-50 rounded-xl"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-blue-600 border-2 border-white" />
          </Button>

          <div className="h-6 w-px bg-slate-200 mx-1 lg:mx-2" />

          {/* User Profile */}
          <button className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              {user?.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name}
              </p>
              <p className="text-[10px] text-slate-500 font-medium lowercase tracking-tight">
                {user?.role} Account
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
