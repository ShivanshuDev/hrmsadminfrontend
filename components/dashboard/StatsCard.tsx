import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "emerald" | "blue" | "indigo" | "amber" | "rose";
  trend?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = "indigo",
  trend,
}: StatsCardProps) {
  const badgeStyles = {
    emerald: "bg-emerald-950/70 text-emerald-400 border-emerald-800/40",
    blue: "bg-blue-950/70 text-blue-400 border-blue-800/40",
    indigo: "bg-indigo-950/70 text-indigo-400 border-indigo-800/40",
    amber: "bg-amber-950/70 text-amber-400 border-amber-800/40",
    rose: "bg-rose-950/70 text-rose-400 border-rose-800/40",
  }[badgeVariant];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {badge && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeStyles}`}>
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{subtitle}</span>
          {trend && <span className="text-emerald-400 font-medium">{trend}</span>}
        </div>
      )}
    </div>
  );
}
