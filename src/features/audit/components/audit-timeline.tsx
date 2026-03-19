import { Package, Users, DollarSign, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuditLog } from "../types";
import { useState } from "react";
import { AuditDiffViewer } from "./audit-diff-viewer"; // Ensure this is imported

const iconMap = {
  INVENTORY: Package,
  HR: Users,
  FINANCE: DollarSign,
  SETTINGS: AlertCircle,
};

export function AuditTimeline({ logs }: { logs: AuditLog[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs.map((log, idx) => {
          const Icon = iconMap[log.module];
          const isExpanded = expandedId === log.id;

          return (
            <li key={log.id}>
              <div className="relative pb-8">
                {idx !== logs.length - 1 && (
                  <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 ring-8 ring-white dark:ring-slate-950">
                      <Icon className="h-5 w-5 text-slate-500" />
                    </div>
                  </div>
                  
                  <div className="min-w-0 flex-1 py-1.5">
                    <div 
                      className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-slate-500">
                          <span className="font-bold text-slate-900 dark:text-white">{log.user.name}</span>
                          {" "}{log.description}{" "}
                          <span className="whitespace-nowrap text-xs text-slate-400">
                            {formatDistanceToNow(new Date(log.timestamp))} ago
                          </span>
                        </div>
                        {log.metadata && (
                          <div className="text-slate-400 group-hover:text-blue-500">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        )}
                      </div>

                      {/* Render Diff Viewer if expanded and data exists */}
                      {isExpanded && log.metadata && (
                        <div className="mt-2 animate-in slide-in-from-top-2 duration-200">
                          <AuditDiffViewer 
                            previous={log.metadata.previousState} 
                            current={log.metadata.newState} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}