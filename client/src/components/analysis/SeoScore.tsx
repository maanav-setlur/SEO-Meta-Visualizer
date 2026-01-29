import { type SeoIssue } from "@shared/schema";
import { cn } from "@/lib/utils";

interface SeoScoreProps {
  issues: SeoIssue[];
}

export function SeoScore({ issues }: SeoScoreProps) {
  // Calculate a simplified score
  const total = 100;
  const penalties = {
    critical: 15,
    warning: 5,
    info: 0,
    success: 0
  };
  
  const score = Math.max(0, issues.reduce((acc, issue) => {
    return acc - (penalties[issue.level] || 0);
  }, total));

  let color = "text-green-600";
  let bg = "bg-green-100";
  let label = "Excellent";

  if (score < 50) {
    color = "text-red-600";
    bg = "bg-red-100";
    label = "Poor";
  } else if (score < 80) {
    color = "text-amber-600";
    bg = "bg-amber-100";
    label = "Needs Improvement";
  }

  return (
    <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border shadow-sm">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-100"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            className={cn("transition-all duration-1000 ease-out", color)}
          />
        </svg>
        <span className={cn("absolute text-3xl font-bold font-display", color)}>{score}</span>
      </div>
      
      <div>
        <h3 className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-1">SEO Health Score</h3>
        <p className={cn("text-2xl font-bold", color)}>{label}</p>
        <p className="text-slate-400 text-sm mt-1">Based on {issues.length} checks performed</p>
      </div>
    </div>
  );
}
