import { ArrowRight } from "lucide-react";

export function AuditDiffViewer({ previous, current }: { previous?: any, current?: any }) {
  if (!previous || !current) return <p className="text-xs text-slate-400">No data changes recorded.</p>;

  const keys = Object.keys(current);

  return (
    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Field Changes</h4>
      <div className="space-y-2">
        {keys.map((key) => {
          if (previous[key] === current[key]) return null;
          return (
            <div key={key} className="flex items-center gap-3 text-sm">
              <span className="font-mono text-blue-600 dark:text-blue-400 w-24 shrink-0">{key}:</span>
              <span className="line-through text-slate-400">{String(previous[key])}</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{String(current[key])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}