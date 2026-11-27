"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Database, HardDrive, RefreshCw, Zap } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { InfrastructureStatus } from "@/types/dashboard";

export function Header() {
  const pathname = usePathname();
  const [infra, setInfra] = useState<InfrastructureStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    const data = await adminService.getInfrastructureHealth();
    setInfra(data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000); // Probe every minute
    return () => clearInterval(interval);
  }, []);

  if (pathname === "/login") return null;

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 fixed top-0 right-0 left-64 z-30 px-8 flex items-center justify-between text-slate-200">
      {/* Title / Current Page indicator */}
      <div className="flex items-center space-x-3">
        <h2 className="text-base font-semibold text-white capitalize">
          {pathname === "/" ? "Global Enterprise Telemetry" : pathname.replace("/", "").replace("-", " ")}
        </h2>
        <span className="px-2 py-0.5 text-[11px] font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full">
          SuperAdmin Mode
        </span>
      </div>

      {/* Live Infrastructure Badges */}
      <div className="flex items-center space-x-3 text-xs">
        {/* PostgreSQL Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>PostgreSQL:</span>
          <span className="font-medium text-emerald-400">Supabase</span>
        </div>

        {/* MongoDB Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
          <span>MongoDB:</span>
          <span className="font-medium text-emerald-400">Atlas</span>
        </div>

        {/* Redis Indicator */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Cache:</span>
          <span className="font-medium text-emerald-400">Active</span>
        </div>

        {/* Latency & Refresh */}
        <button
          onClick={fetchHealth}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Refresh database diagnostics"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
          {infra?.latencyMs && <span className="text-[11px]">{infra.latencyMs}ms</span>}
        </button>
      </div>
    </header>
  );
}
