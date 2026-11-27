"use client";

import React, { useState } from "react";
import { X, Building2, GitBranch, MapPin, Phone, Mail, Globe, Shield, User, Calendar } from "lucide-react";
import { Company } from "@/types/company";

interface Props {
  company: Company | null;
  onClose: () => void;
}

export function CompanyModal({ company, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "branches" | "governance">("overview");

  if (!company) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{company.companyName}</h3>
              <p className="text-xs text-indigo-400 font-medium">{company.businessSector}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 space-x-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview & Legal
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`py-3 border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === "branches"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Branches</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-slate-800 rounded-full text-indigo-300">
              {company.branches?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("governance")}
            className={`py-3 border-b-2 transition-all ${
              activeTab === "governance"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Leadership & Governance
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-5">
              {company.description && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">About Organization</h4>
                  <p className="text-sm text-slate-300 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
                    {company.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">GSTIN Number</span>
                  <span className="font-semibold text-white font-mono text-sm">{company.gstNumber}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">PAN Number</span>
                  <span className="font-semibold text-white font-mono text-sm">{company.panNumber}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Registration CIN</span>
                  <span className="font-semibold text-slate-200 font-mono">{company.registrationNumber || "—"}</span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Corporate Email</span>
                  <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{company.email}</span>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Registered Headquarters</h4>
                <div className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-800/30 p-3 rounded-lg border border-slate-800">
                  <MapPin className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <span>{company.address}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "branches" && (
            <div className="space-y-3">
              {company.branches && company.branches.length > 0 ? (
                company.branches.map((b) => (
                  <div
                    key={b.id || b.code}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm">{b.name}</span>
                        {b.isHq && (
                          <span className="px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full font-medium">
                            HQ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.city}, {b.state}</span>
                        </span>
                        {b.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded text-slate-300">
                      {b.code}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No branches configured for this enterprise.
                </div>
              )}
            </div>
          )}

          {activeTab === "governance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Director</span>
                  <span className="font-bold text-white text-sm">{company.directorName}</span>
                </div>
                <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block mb-1">Chief Executive Officer (CEO)</span>
                  <span className="font-bold text-white text-sm">{company.ceoName}</span>
                </div>
                {company.ctoName && (
                  <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-1">Chief Technology Officer (CTO)</span>
                    <span className="font-bold text-slate-200">{company.ctoName}</span>
                  </div>
                )}
                {company.cooName && (
                  <div className="bg-slate-800/40 p-3.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block mb-1">Chief Operating Officer (COO)</span>
                    <span className="font-bold text-slate-200">{company.cooName}</span>
                  </div>
                )}
              </div>

              {company.boardMembers && company.boardMembers.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Board of Governance
                  </h4>
                  <div className="space-y-2">
                    {company.boardMembers.map((bm, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 text-xs"
                      >
                        <span className="font-medium text-slate-200">{bm.name}</span>
                        <span className="text-indigo-400">{bm.designation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
