import { useState, useEffect } from "react";
import { type SeoIssue, type MetaTags } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Globe, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

interface SeoScoreProps {
  issues: SeoIssue[];
  meta: MetaTags;
}

export function SeoScore({ issues, meta }: SeoScoreProps) {
  const total = 100;
  const penalties = {
    critical: 15,
    warning: 5,
    info: 0,
    success: 0
  };
  
  const targetScore = Math.max(0, issues.reduce((acc, issue) => {
    return acc - (penalties[issue.level] || 0);
  }, total));

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1500;
    const steps = 60;
    const increment = targetScore / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        setAnimatedScore(targetScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [targetScore]);

  let color = "text-green-600";
  let strokeColor = "stroke-green-500";
  let label = "Excellent";
  let bgGradient = "from-green-50 to-emerald-50";

  if (targetScore < 50) {
    color = "text-red-600";
    strokeColor = "stroke-red-500";
    label = "Poor";
    bgGradient = "from-red-50 to-orange-50";
  } else if (targetScore < 80) {
    color = "text-amber-600";
    strokeColor = "stroke-amber-500";
    label = "Needs Work";
    bgGradient = "from-amber-50 to-yellow-50";
  }

  const titleLength = meta.title?.length || 0;
  const descLength = meta.description?.length || 0;
  
  const titleStatus = titleLength === 0 ? "missing" : titleLength < 30 ? "short" : titleLength > 60 ? "long" : "good";
  const descStatus = descLength === 0 ? "missing" : descLength < 120 ? "short" : descLength > 160 ? "long" : "good";

  const getStatusColor = (status: string) => {
    if (status === "good") return "text-green-600 bg-green-100";
    if (status === "missing") return "text-red-600 bg-red-100";
    return "text-amber-600 bg-amber-100";
  };

  const getStatusIcon = (status: string) => {
    if (status === "good") return <CheckCircle2 className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const criticalCount = issues.filter(i => i.level === "critical").length;
  const warningCount = issues.filter(i => i.level === "warning").length;
  const successCount = issues.filter(i => i.level === "success").length;

  return (
    <div className={cn("p-4 sm:p-6 bg-gradient-to-br rounded-xl sm:rounded-2xl border shadow-sm", bgGradient)}>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Animated Score Circle */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="10"
              className="text-white/60"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="transparent"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 - (326.7 * animatedScore) / 100}
              className={cn("transition-all duration-100", strokeColor)}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className={cn("text-3xl sm:text-4xl font-bold tabular-nums", color)} data-testid="text-score">
              {animatedScore}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium">/ 100</span>
          </div>
        </div>
        
        {/* Score Info */}
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-slate-500 font-medium uppercase tracking-wider text-[10px] sm:text-xs mb-1">SEO Health</h3>
          <p className={cn("text-xl sm:text-2xl font-bold mb-2", color)} data-testid="text-score-label">{label}</p>
          
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
            {criticalCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                {warningCount} Warning{warningCount > 1 ? 's' : ''}
              </span>
            )}
            {successCount > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {successCount} Passed
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Meta Stats Bar */}
      <div className="mt-4 pt-4 border-t border-slate-200/50 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5 sm:p-3">
          <div className={cn("p-1.5 rounded-md", getStatusColor(titleStatus))}>
            <Globe className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Title</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm sm:text-base font-bold text-slate-800">{titleLength} <span className="text-slate-400 font-normal text-xs">chars</span></p>
              {getStatusIcon(titleStatus)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2.5 sm:p-3">
          <div className={cn("p-1.5 rounded-md", getStatusColor(descStatus))}>
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Description</p>
            <div className="flex items-center gap-1.5">
              <p className="text-sm sm:text-base font-bold text-slate-800">{descLength} <span className="text-slate-400 font-normal text-xs">chars</span></p>
              {getStatusIcon(descStatus)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
