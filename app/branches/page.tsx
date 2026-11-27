"use client";

import React, { useEffect, useState } from "react";
import { GitBranch, Search, MapPin, Phone, Building2, Filter } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { IBranch } from "@/types/company";

export default function BranchesPage() {
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("all");

  useEffect(() => {
    async function loadBranches() {
      setLoading(true);
      const data = await adminService.getAllBranches();
      setBranches(data);
      setLoading(false);
    }
    loadBranches();
  }, []);

  const states = Array.from(new Set(branches.map((b) => b.state).filter(Boolean)));

  const filtered = branches.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "all" || b.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Enterprise Branch Network</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Consolidated directory of all corporate headquarters, regional offices, and facility branches.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium shadow-2xs">
            Total Branches: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{branches.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-2xs transition-colors">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search branch name, code, city, or parent enterprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto transition-colors"
          >
            <option value="all">All States / Territories</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Branches Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-5">Branch Name & Code</th>
                <th className="py-3.5 px-5">Parent Enterprise</th>
                <th className="py-3.5 px-5">City & State</th>
                <th className="py-3.5 px-5">Contact Phone</th>
                <th className="py-3.5 px-5 text-right">Facility Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                    Loading branch network from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No branches found matching your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={`${b.companyId}-${b.id || b.code}`} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                        {b.isHq && (
                          <span className="px-2 py-0.5 text-[9px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-md font-bold uppercase">
                            HQ
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{b.code}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.companyName || "Enterprise"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{b.city}, {b.state}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">
                      {b.phone ? (
                        <div className="flex items-center space-x-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{b.phone}</span>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          b.isHq
                            ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/40"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {b.isHq ? "Headquarters" : "Regional Branch"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
