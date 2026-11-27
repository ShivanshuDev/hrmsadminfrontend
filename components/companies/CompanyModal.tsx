"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  GitBranch,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  User,
  Calendar,
  Edit3,
  Plus,
  Trash2,
  Check,
  Loader2,
  Save,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";
import { Company, IBranch } from "@/types/company";
import { adminService } from "@/services/admin.service";

interface Props {
  company: Company | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export function CompanyModal({ company: initialCompany, onClose, onUpdate }: Props) {
  const [company, setCompany] = useState<Company | null>(initialCompany);
  const [activeTab, setActiveTab] = useState<"overview" | "branches" | "governance">("overview");

  // Company Editing state
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<Partial<Company>>({});

  // Branch Editing / Creating state
  const [isBranchFormOpen, setIsBranchFormOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [isSavingBranch, setIsSavingBranch] = useState(false);
  const [branchForm, setBranchForm] = useState<Partial<IBranch>>({
    name: "",
    code: "",
    branchType: "Regional Branch",
    isHq: false,
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    phone: "",
    email: "",
    gstin: "",
    branchHeadName: "",
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    setCompany(initialCompany);
    if (initialCompany) {
      setCompanyForm({
        companyName: initialCompany.companyName,
        businessSector: initialCompany.businessSector,
        businessCategory: initialCompany.businessCategory,
        email: initialCompany.email,
        mobileNumber: initialCompany.mobileNumber,
        address: initialCompany.address,
        websiteLink: initialCompany.websiteLink,
        directorName: initialCompany.directorName,
        ceoName: initialCompany.ceoName,
        ctoName: initialCompany.ctoName,
        cooName: initialCompany.cooName,
        gstNumber: initialCompany.gstNumber,
        panNumber: initialCompany.panNumber,
        registrationNumber: initialCompany.registrationNumber,
        timing: initialCompany.timing,
        description: initialCompany.description,
        rulesRegulations: initialCompany.rulesRegulations,
      });
    }
  }, [initialCompany]);

  if (!company) return null;

  const companyId = String(company._id || company.id || "");

  // Handle Company Details Save
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCompany(true);
    setFeedback(null);
    try {
      const updated = await adminService.updateCompany(companyId, companyForm);
      setCompany(updated);
      setIsEditingCompany(false);
      setFeedback({ type: "success", message: "Enterprise profile successfully updated in database." });
      onUpdate?.();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.response?.data?.message || err?.message || "Failed to update enterprise" });
    } finally {
      setIsSavingCompany(false);
    }
  };

  // Open Branch Create Form
  const handleOpenAddBranch = () => {
    setEditingBranchId(null);
    setBranchForm({
      name: "",
      code: `BR-${Math.floor(100 + Math.random() * 900)}`,
      branchType: "Regional Branch",
      isHq: false,
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      phone: company.mobileNumber || "",
      email: company.email || "",
      gstin: company.gstNumber || "",
      branchHeadName: "",
    });
    setIsBranchFormOpen(true);
  };

  // Open Branch Edit Form
  const handleOpenEditBranch = (branch: IBranch) => {
    setEditingBranchId(branch.id || branch.code);
    setBranchForm({ ...branch });
    setIsBranchFormOpen(true);
  };

  // Save Branch (Create or Update)
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name?.trim()) {
      setFeedback({ type: "error", message: "Branch name is required" });
      return;
    }
    if (!branchForm.city?.trim() || !branchForm.state?.trim()) {
      setFeedback({ type: "error", message: "City and state are required" });
      return;
    }

    setIsSavingBranch(true);
    setFeedback(null);

    try {
      if (editingBranchId) {
        const res = await adminService.updateBranch(companyId, editingBranchId, branchForm);
        setCompany(res.company);
        setFeedback({ type: "success", message: `Branch "${branchForm.name}" updated successfully.` });
      } else {
        const res = await adminService.addBranch(companyId, branchForm);
        setCompany(res.company);
        setFeedback({ type: "success", message: `Branch "${branchForm.name}" added to enterprise.` });
      }
      setIsBranchFormOpen(false);
      setEditingBranchId(null);
      onUpdate?.();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.response?.data?.message || err?.message || "Failed to save branch" });
    } finally {
      setIsSavingBranch(false);
    }
  };

  // Delete Branch
  const handleDeleteBranch = async (branchId: string, branchName: string) => {
    if (!confirm(`Are you sure you want to remove the branch "${branchName}" from ${company.companyName}?`)) {
      return;
    }

    setFeedback(null);
    try {
      const res = await adminService.deleteBranch(companyId, branchId);
      setCompany(res.company);
      setFeedback({ type: "success", message: `Branch "${branchName}" was removed.` });
      onUpdate?.();
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.response?.data?.message || err?.message || "Failed to remove branch" });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-800 dark:text-slate-200 transition-colors overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{company.companyName}</h3>
                {isEditingCompany && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40 rounded-md">
                    Editing Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{company.businessSector}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditingCompany ? (
              <button
                onClick={() => {
                  setIsEditingCompany(true);
                  setActiveTab("overview");
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="Edit Enterprise Information"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Edit Enterprise</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditingCompany(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel Edit
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              feedback.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40"
                : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40"
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 space-x-6 text-sm font-semibold bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Overview & Legal
          </button>
          <button
            onClick={() => setActiveTab("branches")}
            className={`py-3.5 border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeTab === "branches"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <span>Branches</span>
            <span className="px-2 py-0.5 text-[10px] bg-indigo-50 dark:bg-slate-800 rounded-full text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-slate-700">
              {company.branches?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("governance")}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === "governance"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Leadership & Governance
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW & LEGAL */}
          {activeTab === "overview" && (
            isEditingCompany ? (
              /* EDIT COMPANY FORM */
              <form onSubmit={handleSaveCompany} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Enterprise Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.companyName || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Industry Sector</label>
                    <input
                      type="text"
                      value={companyForm.businessSector || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, businessSector: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">GSTIN Number</label>
                    <input
                      type="text"
                      value={companyForm.gstNumber || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, gstNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">PAN Number</label>
                    <input
                      type="text"
                      value={companyForm.panNumber || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, panNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Corporate Email</label>
                    <input
                      type="email"
                      value={companyForm.email || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Corporate Phone</label>
                    <input
                      type="text"
                      value={companyForm.mobileNumber || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, mobileNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Registered Headquarters Street Address</label>
                    <input
                      type="text"
                      value={companyForm.address || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Website URL</label>
                    <input
                      type="text"
                      value={companyForm.websiteLink || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, websiteLink: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Office Working Hours / Timing</label>
                    <input
                      type="text"
                      value={companyForm.timing || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, timing: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">About Enterprise / Description</label>
                    <textarea
                      rows={3}
                      value={companyForm.description || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCompany}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCompany ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Enterprise Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */
              <div className="space-y-5">
                {company.description && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">About Organization</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                      {company.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">GSTIN Number</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">{company.gstNumber}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">PAN Number</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">{company.panNumber}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Registration CIN</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{company.registrationNumber || "—"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Corporate Email</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{company.email}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Corporate Phone</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{company.mobileNumber}</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Office Timings</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{company.timing || "Standard 9:00 AM - 6:00 PM"}</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Registered Headquarters</h4>
                  <div className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                    <span>{company.address}</span>
                  </div>
                </div>
              </div>
            )
          )}

          {/* TAB 2: BRANCH NETWORK WITH ADD & EDIT */}
          {activeTab === "branches" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Enterprise Branch Network</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage all operational offices, regional headquarters, and branches.
                  </p>
                </div>

                {!isBranchFormOpen && (
                  <button
                    onClick={handleOpenAddBranch}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Branch</span>
                  </button>
                )}
              </div>

              {/* BRANCH ADD / EDIT INLINE FORM */}
              {isBranchFormOpen && (
                <form
                  onSubmit={handleSaveBranch}
                  className="bg-indigo-50/40 dark:bg-slate-800/80 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-700 pb-3">
                    <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <GitBranch className="w-4 h-4" />
                      <span>{editingBranchId ? "Edit Branch Information" : "Register New Branch"}</span>
                    </h5>
                    <button
                      type="button"
                      onClick={() => setIsBranchFormOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Branch Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mumbai Regional Exchange Hub"
                        value={branchForm.name || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Branch Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BOM-01"
                        value={branchForm.code || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Facility Type</label>
                      <select
                        value={branchForm.branchType || "Regional Branch"}
                        onChange={(e) => setBranchForm({ ...branchForm, branchType: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        <option value="Regional Branch">Regional Branch</option>
                        <option value="Headquarters">Headquarters</option>
                        <option value="Technology & R&D Hub">Technology & R&D Hub</option>
                        <option value="Operations & Fulfillment Annex">Operations & Fulfillment Annex</option>
                        <option value="Sales & Customer Center">Sales & Customer Center</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2 pt-5">
                      <input
                        type="checkbox"
                        id="isHq"
                        checked={Boolean(branchForm.isHq)}
                        onChange={(e) => setBranchForm({ ...branchForm, isHq: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <label htmlFor="isHq" className="font-bold text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                        Mark as Primary Headquarters (HQ)
                      </label>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Branch Address</label>
                      <input
                        type="text"
                        placeholder="Street, Building, Floor..."
                        value={branchForm.address || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mumbai"
                        value={branchForm.city || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">State / Province *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maharashtra"
                        value={branchForm.state || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Contact Phone</label>
                      <input
                        type="text"
                        placeholder="+91..."
                        value={branchForm.phone || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Branch Head / Director</label>
                      <input
                        type="text"
                        placeholder="Leader Name"
                        value={branchForm.branchHeadName || ""}
                        onChange={(e) => setBranchForm({ ...branchForm, branchHeadName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-indigo-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setIsBranchFormOpen(false)}
                      className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingBranch}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingBranch ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Branch to DB...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{editingBranchId ? "Save Branch Changes" : "Save Branch"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF BRANCHES */}
              <div className="space-y-3">
                {company.branches && company.branches.length > 0 ? (
                  company.branches.map((b) => (
                    <div
                      key={b.id || b.code}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-slate-700 transition-all shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{b.name}</span>
                          {b.isHq && (
                            <span className="px-2 py-0.5 text-[9px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 rounded-md font-bold uppercase">
                              HQ
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium">({b.branchType || "Regional"})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{b.city}, {b.state} {b.address ? `• ${b.address}` : ""}</span>
                          </span>
                          {b.phone && (
                            <span className="flex items-center space-x-1">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{b.phone}</span>
                            </span>
                          )}
                          {b.branchHeadName && (
                            <span className="flex items-center space-x-1">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Head: {b.branchHeadName}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="font-mono text-xs px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold">
                          {b.code}
                        </span>

                        {/* Edit Branch Button */}
                        <button
                          onClick={() => handleOpenEditBranch(b)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                          title="Edit this branch"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Branch Button */}
                        <button
                          onClick={() => handleDeleteBranch(b.id || b.code, b.name)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete branch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    No branches configured for this enterprise yet. Click "+ Add New Branch" above.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: LEADERSHIP & GOVERNANCE */}
          {activeTab === "governance" && (
            isEditingCompany ? (
              /* EDIT LEADERSHIP FORM */
              <form onSubmit={handleSaveCompany} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Managing Director *</label>
                    <input
                      type="text"
                      required
                      value={companyForm.directorName || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, directorName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Chief Executive Officer (CEO)</label>
                    <input
                      type="text"
                      value={companyForm.ceoName || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, ceoName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Chief Technology Officer (CTO)</label>
                    <input
                      type="text"
                      value={companyForm.ctoName || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, ctoName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Chief Operating Officer (COO)</label>
                    <input
                      type="text"
                      value={companyForm.cooName || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, cooName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Rules & Regulations / Corporate Conduct Policy</label>
                    <textarea
                      rows={4}
                      value={companyForm.rulesRegulations || ""}
                      onChange={(e) => setCompanyForm({ ...companyForm, rulesRegulations: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingCompany(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingCompany}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingCompany ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Leadership...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Leadership</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Director</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{company.directorName || "—"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Chief Executive Officer</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{company.ceoName || "—"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Chief Technology Officer</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{company.ctoName || "—"}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block mb-1">Chief Operating Officer</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{company.cooName || "—"}</span>
                  </div>
                </div>

                {company.rulesRegulations && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Statutory Policies & Code of Conduct
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                      {company.rulesRegulations}
                    </p>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
