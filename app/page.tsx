"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  GitBranch,
  Users,
  Bell,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { PlatformMetrics, InfrastructureStatus } from "@/types/dashboard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { InfrastructureHealth } from "@/components/dashboard/InfrastructureHealth";
import { CompanyModal } from "@/components/companies/CompanyModal";
import { Company } from "@/types/company";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [infra, setInfra] = useState<InfrastructureStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [m, inf] = await Promise.all([
      adminService.getPlatformMetrics(),
      adminService.getInfrastructureHealth(),
    ]);
    setMetrics(m);
    setInfra(inf);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant Enterprise Hub</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Command Center</h1>
          <p className="text-sm text-slate-400">
            Real-time multi-tenant telemetry for all registered enterprises, branches, workforce, and broadcasts.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Synchronize Data</span>
        </button>
      </div>

      {/* Infrastructure Health Diagnostics */}
      <InfrastructureHealth status={infra} />

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="REGISTERED ENTERPRISES"
          value={metrics?.totalCompanies || (loading ? "..." : 0)}
          subtitle="Direct from MongoDB Atlas"
          icon={Building2}
          badge="100% Cloud DB"
          badgeVariant="emerald"
        />

        <StatsCard
          title="ACTIVE BRANCHES"
          value={metrics?.totalBranches || (loading ? "..." : 0)}
          subtitle="Nationwide Branch Network"
          icon={GitBranch}
          badge="Multi-Location"
          badgeVariant="indigo"
        />

        <StatsCard
          title="ONBOARDED WORKFORCE"
          value={metrics?.totalEmployees || (loading ? "..." : 0)}
          subtitle="Supabase PostgreSQL Store"
          icon={Users}
          badge="Prisma Relational"
          badgeVariant="blue"
        />

        <StatsCard
          title="COMPANY BROADCASTS"
          value={metrics?.totalAnnouncements || (loading ? "..." : 0)}
          subtitle="Active Corporate Notices"
          icon={Bell}
          badge="Live Feed"
          badgeVariant="amber"
        />
      </div>

      {/* Two Column Section: Recent Companies & Sector Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Companies (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Registered Organizations</h3>
              <p className="text-xs text-slate-400">Recently onboarded enterprise entities</p>
            </div>
            <Link
              href="/companies"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">Sector</th>
                  <th className="pb-3">GSTIN</th>
                  <th className="pb-3 text-center">Branches</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics?.recentCompanies && metrics.recentCompanies.length > 0 ? (
                  metrics.recentCompanies.map((comp) => (
                    <tr key={comp._id || comp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-white">{comp.companyName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[200px]">{comp.address}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                          {comp.businessSector.replace(/^\d+\.\s*/, "")}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-slate-300">{comp.gstNumber}</td>
                      <td className="py-3.5 text-center">
                        <span className="px-2 py-0.5 bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 rounded-full font-bold text-[11px]">
                          {comp.branches?.length || 0}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setSelectedCompany(comp)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">
                      {loading ? "Connecting to MongoDB Atlas..." : "No companies found in database."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sector Distribution (1 col) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Industry Distribution</h3>
            <p className="text-xs text-slate-400 mb-5">Registered companies by economic sector</p>

            <div className="space-y-3.5">
              {metrics?.sectorBreakdown && Object.keys(metrics.sectorBreakdown).length > 0 ? (
                Object.entries(metrics.sectorBreakdown).map(([sector, count]) => {
                  const percent = Math.round((count / (metrics?.totalCompanies || 1)) * 100);
                  const cleanSector = sector.replace(/^\d+\.\s*/, "");

                  return (
                    <div key={sector} className="text-xs space-y-1">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="truncate max-w-[180px] font-medium">{cleanSector}</span>
                        <span className="font-semibold text-white">
                          {count} <span className="text-slate-400 font-normal">({percent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-500 h-1.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {loading ? "Calculating metrics..." : "No sector data available."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 mt-6">
            <Link
              href="/branches"
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-semibold rounded-xl flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Explore Branch Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Selected Company Modal */}
      <CompanyModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </div>
  );
}
