"use client";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { QuickActions } from "@/components/shared/quick-actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 1. Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50 border-r border-slate-200/60 dark:border-slate-800">
        <Sidebar />
      </aside>

      {/* 2. Stretched Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col">
        <Header />

        {/* Removed 'p-10' and replaced with 'p-6' to increase usable space */}
        <main className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-900/20">
          {/* CRITICAL CHANGE: 
              Removed 'max-w-7xl' or 'max-w-[1600px]'. 
              Using 'w-full' ensures content touches the edges of the screen.
          */}
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
      
      <QuickActions />
    </div>
  );
}