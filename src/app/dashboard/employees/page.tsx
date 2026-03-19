"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { EmployeeCard } from "@/features/employees/components/employee-card";
import { useGetEmployees } from "@/features/employees/api/use-get-employees";
import { AddEmployeeSheet } from "@/features/employees/components/add-employee-sheet";

export default function EmployeesPage() {
  const [activeRole, setActiveRole] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: employees, isLoading } = useGetEmployees();

  // Logic: Combined Search & Role Filtering
  const filteredEmployees = employees?.filter((emp) => {
    const matchesRole =
      activeRole === "ALL" || emp.role.toUpperCase() === activeRole;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Team Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Manage company access, roles, and department assignments.
          </p>
        </div>

        <Button
          onClick={() => setIsSheetOpen(true)}
          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>
      <AddEmployeeSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      <div className="space-y-6">
        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Tabs
            defaultValue="ALL"
            onValueChange={setActiveRole}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <TabsTrigger value="ALL" className="rounded-lg font-bold">
                All Team
              </TabsTrigger>
              <TabsTrigger value="ADMIN" className="rounded-lg font-bold">
                Admins
              </TabsTrigger>
              <TabsTrigger value="MANAGER" className="rounded-lg font-bold">
                Managers
              </TabsTrigger>
              <TabsTrigger value="VIEWER" className="rounded-lg font-bold">
                Viewers
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search team..."
              className="pl-10 rounded-xl bg-white dark:bg-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <p className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="text-slate-900 dark:text-white font-bold">
              {filteredEmployees?.length || 0}
            </span>{" "}
            members
          </p>
        </div>

        {/* Employee Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees?.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}

            {/* Empty State when filtering returns nothing */}
            {filteredEmployees?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-500 font-medium">
                  No team members found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
