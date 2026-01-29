import { Link, useLocation } from "wouter";
import { History, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "New Analysis", href: "/", icon: Search },
  { name: "History", href: "/history", icon: History },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 flex-shrink-0">
      <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            S
          </div>
          <span className="text-xl font-bold">SEO Vision</span>
        </div>
        {onClose && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800"
            data-testid="button-close-sidebar"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 sm:px-4 sm:py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={onClose}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 font-medium"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
                data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
                <span className="truncate">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-slate-800">
        <p className="text-xs text-slate-600 text-center">SEO Meta Tag Analyzer</p>
      </div>
    </div>
  );
}
