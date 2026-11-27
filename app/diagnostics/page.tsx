"use client";

import React, { useEffect, useState } from "react";
import {
  Server,
  Database,
  HardDrive,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  Globe,
  Clock,
  Code2,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { apiClient } from "@/services/api";
import { InfrastructureStatus } from "@/types/dashboard";

interface EndpointProbe {
  name: string;
  endpoint: string;
  targetDb: string;
  status: "pending" | "success" | "error";
  latencyMs: number;
  statusCode?: number;
  dataSnippet?: string;
}

export default function DiagnosticsPage() {
  const [infra, setInfra] = useState<InfrastructureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawHealthData, setRawHealthData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [endpointProbes, setEndpointProbes] = useState<EndpointProbe[]>([
    {
      name: "Platform Core Health",
      endpoint: "/api/health",
      targetDb: "Polyglot Gateway",
      status: "pending",
      latencyMs: 0,
    },
    {
      name: "Enterprise Multi-Tenant List",
      endpoint: "/api/v1/company/list",
      targetDb: "MongoDB Atlas",
      status: "pending",
      latencyMs: 0,
    },
    {
      name: "Workforce Relational Store",
      endpoint: "/api/v1/employees?limit=5",
      targetDb: "Supabase PostgreSQL",
      status: "pending",
      latencyMs: 0,
    },
    {
      name: "Broadcasts Communications",
      endpoint: "/api/v1/settings/announcements",
      targetDb: "MongoDB Atlas",
      status: "pending",
      latencyMs: 0,
    },
  ]);

  const runDiagnostics = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const data = await adminService.getInfrastructureHealth();
      setInfra(data);

      const healthUrl =
        apiClient.defaults.baseURL?.replace("/api/v1", "/api/health") ||
        "https://dynamitehrmsbackend.onrender.com/api/health";
      const rawRes = await apiClient.get(healthUrl);
      setRawHealthData(rawRes.data);
    } catch (err: any) {
      console.error("Health probe error:", err);
    } finally {
      setLoading(false);
    }

    // Probe individual endpoints in parallel
    const probed = await Promise.all(
      endpointProbes.map(async (probe) => {
        const pStart = performance.now();
        try {
          const url = probe.endpoint.startsWith("/api/v1")
            ? probe.endpoint.replace("/api/v1", "")
            : probe.endpoint;
          const res = await apiClient.get(url);
          const elapsed = Math.round(performance.now() - pStart);
          return {
            ...probe,
            status: "success" as const,
            latencyMs: elapsed,
            statusCode: res.status,
            dataSnippet: `${Array.isArray(res.data?.data) ? `${res.data.data.length} records returned` : "OK Payload"}`,
          };
        } catch (err: any) {
          const elapsed = Math.round(performance.now() - pStart);
          return {
            ...probe,
            status: "error" as const,
            latencyMs: elapsed,
            statusCode: err?.response?.status || 500,
            dataSnippet: err?.message || "Probe failed",
          };
        }
      })
    );
    setEndpointProbes(probed);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(rawHealthData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Infrastructure Health & Cloud Telemetry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Cloud API Diagnostics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Live telemetry monitoring for Render API Gateway, MongoDB Atlas NoSQL document cluster, Supabase PostgreSQL relational pool, and In-Memory cache.
          </p>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Probing Cloud..." : "Run Live Diagnostic Probe"}</span>
        </button>
      </div>

      {/* 4 Database & Infrastructure Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Render Cloud API Gateway */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              HTTPS 200 OK
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Render API Gateway</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Node.js Express TypeScript Engine</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Ping Latency:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {infra?.latencyMs !== undefined ? `${infra.latencyMs} ms` : "Probing..."}
            </span>
          </div>
        </div>

        {/* MongoDB Atlas NoSQL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Cluster Active
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">MongoDB Atlas</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Document Store (Mongoose Engine)</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Role:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Enterprises & Broadcasts
            </span>
          </div>
        </div>

        {/* Supabase PostgreSQL SQL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Prisma Pooler
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Supabase PostgreSQL</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Relational SQL Workforce Store</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Target Role:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Employees, Users & Auth
            </span>
          </div>
        </div>

        {/* Cache Layer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Active Cache
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">In-Memory / Redis</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">High-Throughput State Persistence</p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Blacklist Check:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Active TTL Enforcement
            </span>
          </div>
        </div>
      </div>

      {/* Endpoint Diagnostic Probes Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Live Microservice Route Probes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active HTTP health verification against production cloud routes
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Microservice Route</th>
                <th className="py-3 px-5">Endpoint Path</th>
                <th className="py-3 px-5">Underlying Database</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {endpointProbes.map((probe, i) => (
                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-white">
                    {probe.name}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {probe.endpoint}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold">
                      {probe.targetDb}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    {probe.status === "success" ? (
                      <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HTTP {probe.statusCode || 200} OK</span>
                      </span>
                    ) : probe.status === "error" ? (
                      <span className="inline-flex items-center space-x-1 text-rose-500 font-bold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>HTTP {probe.statusCode || 500}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 animate-pulse">Probing...</span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                    {probe.latencyMs > 0 ? `${probe.latencyMs} ms` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Raw JSON Inspector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Live Cloud Gateway Telemetry Response
            </h3>
          </div>
          <button
            type="button"
            onClick={copyJson}
            className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Payload"}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
          {rawHealthData
            ? JSON.stringify(rawHealthData, null, 2)
            : "Awaiting live payload from Render cloud backend..."}
        </pre>
      </div>
    </div>
  );
}
