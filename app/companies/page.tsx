"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Globe,
  GitBranch,
  ArrowUpRight,
  LayoutGrid,
  Table as TableIcon,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Company } from "@/types/company";
import { CompanyModal } from "@/components/companies/CompanyModal";
import { RegisterCompanyModal } from "@/components/companies/RegisterCompanyModal";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    const data = await adminService.getAllCompanies();
    setCompanies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const sectors = Array.from(
    new Set(companies.map((c) => c.businessSector).filter(Boolean))
  );

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.directorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector =
      selectedSector === "all" || c.businessSector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Registered Enterprises</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Comprehensive registry of all enterprise organizations and operational headquarters.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 shadow-2xs font-medium">
            Total Enterprises: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{companies.length}</strong>
          </span>

          {/* Register Enterprise Button */}
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register Enterprise</span>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs transition-colors">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name, GSTIN, or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Sector Filter */}
          <div className="flex items-center space-x-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="all">All Industry Sectors</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec.replace(/^\d+\.\s*/, "")}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Toggle: Cards vs Table */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 shrink-0">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "cards"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === "table"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title="Data Table View"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Cards or Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm font-medium">
          Loading enterprises from MongoDB Atlas...
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 text-sm">
          No enterprises match your search criteria.
        </div>
      ) : viewMode === "cards" ? (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((comp) => (
            <div
              key={comp._id || comp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {comp.companyName}
                    </h3>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700/60 mt-1">
                      {comp.businessSector.replace(/^\d+\.\s*/, "")}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 my-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{comp.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{comp.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    <span className="text-slate-400 font-sans font-medium">GST:</span>
                    <span className="font-semibold">{comp.gstNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    <strong className="text-slate-900 dark:text-white font-bold">{comp.branches?.length || 0}</strong> Branches
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCompany(comp)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-200 dark:border-transparent cursor-pointer"
                >
                  <span>Manage</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-5">Enterprise Name</th>
                  <th className="py-3.5 px-5">Industry Sector</th>
                  <th className="py-3.5 px-5">Tax & CIN</th>
                  <th className="py-3.5 px-5">Corporate Contact</th>
                  <th className="py-3.5 px-5">Executive Leadership</th>
                  <th className="py-3.5 px-5 text-center">Branches</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredCompanies.map((comp) => (
                  <tr key={comp._id || comp.id} className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{comp.companyName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{comp.address}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700">
                        {comp.businessSector.replace(/^\d+\.\s*/, "")}
                      </span>
                      {comp.businessCategory && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[180px] truncate">
                          {comp.businessCategory}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-600 dark:text-slate-300">
                      <div>GST: <span className="font-bold text-slate-900 dark:text-white">{comp.gstNumber}</span></div>
                      <div className="text-[10px] text-slate-400">PAN: {comp.panNumber}</div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">
                      <div className="truncate max-w-[180px] font-medium">{comp.email}</div>
                      <div className="text-[10px] text-slate-400">{comp.mobileNumber}</div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">
                      <div className="font-bold text-slate-900 dark:text-white">{comp.directorName || comp.ceoName}</div>
                      <div className="text-[10px] text-slate-400">CEO / Managing Director</div>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40 rounded-full font-bold text-xs">
                        {comp.branches?.length || 0}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedCompany(comp)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white rounded-lg text-xs font-bold transition-colors border border-slate-200 dark:border-transparent cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Company Modal */}
      <CompanyModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onUpdate={loadCompanies}
      />

      {/* Register New Enterprise Modal */}
      <RegisterCompanyModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={loadCompanies}
      />
    </div>
  );
}
