"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Database, HardDrive, RefreshCw, Zap, Sun, Moon } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { InfrastructureStatus } from "@/types/dashboard";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
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

  const getPageTitle = () => {
    if (pathname === "/") return "Global Enterprise Telemetry";
    if (pathname === "/diagnostics") return "Cloud API Diagnostics";
    return pathname.replace("/", "").replace("-", " ");
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 left-64 z-30 px-8 flex items-center justify-between text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Title / Current Page indicator */}
      <div className="flex items-center space-x-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white capitalize tracking-tight">
          {getPageTitle()}
        </h2>
        <span className="px-2.5 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full uppercase tracking-wider">
          SuperAdmin Mode
        </span>
      </div>

      {/* Live Infrastructure Badges & Controls */}
      <div className="flex items-center space-x-2.5 text-xs">
        {/* PostgreSQL Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
          <Database className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          <span className="text-[11px]">PostgreSQL:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Supabase</span>
        </div>

        {/* MongoDB Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
          <HardDrive className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span className="text-[11px]">MongoDB:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Atlas</span>
        </div>

        {/* Redis Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span className="text-[11px]">Cache:</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
        </div>

        {/* Latency & Refresh */}
        <button
          onClick={fetchHealth}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          title="Refresh database diagnostics"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-600 dark:text-indigo-400" : ""}`} />
          {infra?.latencyMs !== undefined && <span className="text-[11px] font-mono font-medium">{infra.latencyMs}ms</span>}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>
      </div>
    </header>
  );
}
