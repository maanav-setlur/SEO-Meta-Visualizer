import { Link, useLocation } from "wouter";
import { LayoutDashboard, History, Search, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "New Analysis", href: "/", icon: Search },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
            S
          </div>
          <span className="text-xl font-bold font-display">SEO Vision</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-500 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}
