import { Skeleton } from "@/components/ui/skeleton";

export function FinanceTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton Rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[60px] ml-auto" />
        </div>
      ))}
    </div>
  );
}