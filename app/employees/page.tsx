"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, Building2, Briefcase, IndianRupee, ShieldCheck } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Employee } from "@/types/employee";
import { Company } from "@/types/company";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");

  const loadData = async () => {
    setLoading(true);
    const [empData, compData] = await Promise.all([
      adminService.getEmployees({
        search: searchTerm || undefined,
        companyId: selectedCompany !== "all" ? selectedCompany : undefined,
        limit: 100,
      }),
      adminService.getAllCompanies(),
    ]);

    setEmployees(empData.items);
    setTotalCount(empData.total);
    setCompanies(compData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCompany]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Onboarded Workforce Directory</h1>
          <p className="text-sm text-slate-400">
            Real-time multi-tenant employee records synchronized with Supabase PostgreSQL via Prisma.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            Total Onboarded: <strong className="text-indigo-400">{totalCount}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee name, email, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="all">All Enterprises</option>
            {companies.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Employees Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-850/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Enterprise & Dept</th>
                <th className="py-3 px-5">Designation</th>
                <th className="py-3 px-5">Compensation</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Connecting to PostgreSQL Supabase instance...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No employees found in the database.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id || emp.employeeId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center space-x-3">
                        {emp.avatar ? (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[10px] text-slate-300">
                            {emp.name?.slice(0, 2).toUpperCase() || "EM"}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-white">{emp.name || `${emp.firstName} ${emp.lastName}`}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{emp.employeeId || emp.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="text-slate-200 font-medium">{emp.companyName || "Enterprise"}</div>
                      <div className="text-[10px] text-slate-400">{emp.department || "General"}</div>
                    </td>

                    <td className="py-3.5 px-5 text-slate-300">
                      <div className="font-medium text-slate-200">{emp.designation}</div>
                      <div className="text-[10px] text-indigo-400 capitalize">{emp.employmentType.replace("_", " ")}</div>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-300">
                      {emp.ctc || emp.salary ? (
                        formatCurrency(emp.ctc || emp.salary || 0)
                      ) : (
                        <span className="text-slate-500 font-sans">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          emp.status === "active"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/40"
                            : emp.status === "on_leave"
                            ? "bg-amber-950/80 text-amber-400 border-amber-800/40"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right text-slate-400">
                      {formatDate(emp.dateOfJoining)}
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
