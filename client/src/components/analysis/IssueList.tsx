import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { type SeoIssue } from "@shared/schema";
import { cn } from "@/lib/utils";

const icons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
};

const styles = {
  critical: "bg-red-50 text-red-900 border-red-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  info: "bg-blue-50 text-blue-900 border-blue-200",
  success: "bg-green-50 text-green-900 border-green-200",
};

const iconStyles = {
  critical: "text-red-600",
  warning: "text-amber-600",
  info: "text-blue-600",
  success: "text-green-600",
};

interface IssueListProps {
  issues: SeoIssue[];
}

export function IssueList({ issues }: IssueListProps) {
  const sortedIssues = [...issues].sort((a, b) => {
    const priority = { critical: 0, warning: 1, info: 2, success: 3 };
    return priority[a.level] - priority[b.level];
  });

  return (
    <div className="space-y-2 sm:space-y-3">
      {sortedIssues.map((issue, idx) => {
        const Icon = icons[issue.level];
        return (
          <div
            key={idx}
            className={cn(
              "flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all hover:shadow-sm",
              styles[issue.level]
            )}
            data-testid={`issue-${issue.level}-${idx}`}
          >
            <div className={cn("mt-0.5 shrink-0", iconStyles[issue.level])}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm">{issue.message}</p>
              {issue.field && (
                <p className="text-[10px] sm:text-xs mt-1 opacity-70 font-mono truncate">Field: {issue.field}</p>
              )}
            </div>
          </div>
        );
      })}
      
      {sortedIssues.length === 0 && (
        <div className="text-center py-8 sm:py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-green-500 opacity-50" />
          <p className="font-medium text-sm sm:text-base">No issues found!</p>
          <p className="text-xs sm:text-sm">This page looks perfectly optimized.</p>
        </div>
      )}
    </div>
  );
}
