import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Briefcase, Calendar } from "lucide-react";
import { Employee } from "../types";

export function EmployeeCard({ employee }: { employee: Employee }) {
  const statusColors = {
    Active: "bg-emerald-500/10 text-emerald-600",
    "On Leave": "bg-amber-500/10 text-amber-600",
    Terminated: "bg-rose-500/10 text-rose-600",
  };
  const roleColors = {
    ADMIN:
      "text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
    MANAGER:
      "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
    VIEWER:
      "text-slate-600 bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20",
  };

  return (
    <Card className="hover:shadow-md transition-all border-slate-200 dark:border-slate-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-lg">
            {employee.name.charAt(0)}
          </div>
          <Badge className={statusColors[employee.status]} variant="secondary">
            {employee.status}
          </Badge>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white">
          {employee.name}
        </h3>
        <div
          className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleColors[employee.role.toUpperCase() as keyof typeof roleColors]}`}
        >
          {employee.role}
        </div>

        <div className="space-y-2 border-t pt-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="h-3 w-3" /> {employee.email}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Briefcase className="h-3 w-3" /> {employee.department}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" /> Joined {employee.joinDate}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
