import React from "react";
import { Server, Database, HardDrive, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import { InfrastructureStatus } from "@/types/dashboard";

interface Props {
  status: InfrastructureStatus | null;
}

export function InfrastructureHealth({ status }: Props) {
  const isHealthy = status?.status === "healthy";

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isHealthy ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <h4 className="text-sm font-semibold text-white">Live Polyglot Persistence Architecture</h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization across MongoDB Atlas (NoSQL), Supabase PostgreSQL (SQL), and Cache layers.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* PostgreSQL */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5 text-blue-400 font-medium mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>Relational (SQL)</span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold truncate">
              {status?.relationalSQL || "Supabase Pooler"}
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Connected</span>
            </div>
          </div>

          {/* MongoDB Atlas */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5 text-emerald-400 font-medium mb-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Document Store</span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold truncate">
              {status?.noSQLDocument || "MongoDB Atlas"}
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Mongoose Live</span>
            </div>
          </div>

          {/* In-Memory / Cache Store */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5 text-amber-400 font-medium mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Cache Layer</span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold truncate">
              {status?.inMemoryCache || "In-Memory / Redis"}
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active</span>
            </div>
          </div>

          {/* API Gateway & Health Status */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
            <div className="flex items-center space-x-1.5 text-indigo-400 font-medium mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>API Gateway</span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold truncate">
              {status?.latencyMs !== undefined ? `${status.latencyMs}ms Latency` : "Live Cloud"}
            </div>
            <div
              className={`flex items-center space-x-1 text-[10px] mt-1 ${
                isHealthy ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isHealthy ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span className="capitalize">{status?.status || "Live"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
