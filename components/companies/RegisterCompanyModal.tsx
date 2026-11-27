"use client";

import React, { useState } from "react";
import { X, Building2, Plus, Loader2, CheckCircle2, AlertCircle, Shield, MapPin, Sparkles } from "lucide-react";
import { adminService } from "@/services/admin.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SECTOR_OPTIONS = [
  "5. Information Technology (IT)",
  "4. Healthcare & Pharmaceuticals",
  "11. Real Estate & Construction",
  "6. Banking, Financial Services & Insurance (BFSI)",
  "1. Agriculture, Dairy & Allied Sectors",
  "2. Automotive & Heavy Engineering",
  "3. Energy, Power, Renewables & Utilities",
  "7. Logistics, Supply Chain, Shipping & Aviation",
  "8. Retail, E-Commerce, Apparel & FMCG",
  "9. Hospitality, Tourism, Travel & Aviation",
  "10. Media, Entertainment, Gaming, Advertising & PR",
  "12. Manufacturing, Metallurgy, Chemicals & Mining",
];

const DEFAULT_COMPANY_IMAGES = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
];

export function RegisterCompanyModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [form, setForm] = useState({
    companyName: "",
    businessSector: SECTOR_OPTIONS[0],
    businessCategory: "Cloud Infrastructure & Software Engineering",
    gstNumber: "",
    panNumber: "",
    registrationNumber: "",
    mobileNumber: "",
    email: "",
    websiteLink: "",
    address: "",
    city: "Bangalore",
    state: "Karnataka",
    directorName: "",
    ceoName: "",
    ctoName: "",
    cooName: "",
    description: "",
    timing: "09:30 AM - 06:30 PM (Mon-Fri) | 40 Hours Flexible",
    rulesRegulations: "1. Zero-tolerance harassment policy.\n2. Biometric attendance compliance.\n3. SOC-2 data confidentiality.",
    superAdminEmail: "",
    superAdminPassword: "password123",
    branchName: "Global Technology Headquarters",
    branchCode: "HQ-01",
    branchCity: "Bangalore",
    branchState: "Karnataka",
    branchPhone: "+91 80 4112 0000",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        companyName: form.companyName.trim(),
        businessSector: form.businessSector,
        businessCategory: form.businessCategory,
        gstNumber: form.gstNumber.trim().toUpperCase(),
        panNumber: form.panNumber.trim().toUpperCase(),
        registrationNumber: form.registrationNumber.trim() || `CIN-${Date.now()}`,
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim().toLowerCase(),
        websiteLink: form.websiteLink.trim(),
        address: `${form.address.trim()}, ${form.city.trim()}, ${form.state.trim()}`,
        companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
        companyImages: DEFAULT_COMPANY_IMAGES,
        directorName: form.directorName.trim() || form.ceoName.trim() || "Managing Director",
        ceoName: form.ceoName.trim() || form.directorName.trim() || "Chief Executive Officer",
        ctoName: form.ctoName.trim() || "Chief Technology Officer",
        cooName: form.cooName.trim() || "Chief Operating Officer",
        boardMembers: [
          { name: form.directorName.trim() || "Director", designation: "Founder & Director" },
          { name: form.ceoName.trim() || "Executive", designation: "Chief Executive Officer" },
        ],
        description: form.description.trim() || `${form.companyName} is an enterprise leader in ${form.businessSector}.`,
        timing: form.timing,
        rulesRegulations: form.rulesRegulations,
        superAdminEmail: form.superAdminEmail.trim() || form.email.trim(),
        superAdminPassword: form.superAdminPassword,
        branches: [
          {
            id: `branch-${Date.now()}`,
            code: form.branchCode.trim().toUpperCase(),
            name: form.branchName.trim(),
            city: form.branchCity.trim(),
            state: form.branchState.trim(),
            phone: form.branchPhone.trim(),
            isHq: true,
          },
        ],
      };

      const res = await adminService.registerCompany(payload);
      setSuccessMsg(res?.message || "Enterprise company successfully registered and provisioned in database!");
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Registration failed. Please check mandatory fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Register New Enterprise</h2>
              <p className="text-xs text-slate-400">
                Directly provisions corporate entity in MongoDB Atlas and configures Super Admin in PostgreSQL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-800/60 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Company Legal Identity */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Corporate Identity & Industry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Company Legal Name *</label>
                <input
                  type="text"
                  required
                  name="companyName"
                  placeholder="e.g. Apex Horizon Technologies Pvt Ltd"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Industry Sector *</label>
                <select
                  name="businessSector"
                  value={form.businessSector}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {SECTOR_OPTIONS.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Business Category / Specialization *</label>
                <input
                  type="text"
                  required
                  name="businessCategory"
                  placeholder="e.g. Cloud Robotics, AI Automation"
                  value={form.businessCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Website URL *</label>
                <input
                  type="url"
                  required
                  name="websiteLink"
                  placeholder="https://apexhorizon.ai"
                  value={form.websiteLink}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Legal & Contact */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>2. Legal Compliance & Contact</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">GSTIN Number *</label>
                <input
                  type="text"
                  required
                  name="gstNumber"
                  placeholder="29AAACA1122B1Z1"
                  value={form.gstNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white uppercase font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">PAN Number *</label>
                <input
                  type="text"
                  required
                  name="panNumber"
                  placeholder="AAACA1122B"
                  value={form.panNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white uppercase font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Registration / CIN</label>
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="CIN-U72200KA2026PTC123456"
                  value={form.registrationNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Corporate Phone *</label>
                <input
                  type="text"
                  required
                  name="mobileNumber"
                  placeholder="+91 80 4500 9000"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="font-semibold text-slate-300">Corporate Email *</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="contact@apexhorizon.ai"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1 md:col-span-3">
                <label className="font-semibold text-slate-300">Headquarters Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="Building 12, Outer Ring Road, Bellandur, Bangalore, Karnataka - 560103"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Executive Leadership */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>3. Executive Leadership & Governance</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Managing Director *</label>
                <input
                  type="text"
                  required
                  name="directorName"
                  placeholder="e.g. Vikramaditya Singhania"
                  value={form.directorName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">CEO Name *</label>
                <input
                  type="text"
                  required
                  name="ceoName"
                  placeholder="e.g. Vikramaditya Singhania"
                  value={form.ceoName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">CTO Name</label>
                <input
                  type="text"
                  name="ctoName"
                  placeholder="e.g. Sameer Kulkarni"
                  value={form.ctoName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">COO Name</label>
                <input
                  type="text"
                  name="cooName"
                  placeholder="e.g. Shalini Nair"
                  value={form.cooName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Primary Headquarters Branch */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>4. Primary Headquarters Branch</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="font-semibold text-slate-300">HQ Branch Name *</label>
                <input
                  type="text"
                  required
                  name="branchName"
                  value={form.branchName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Branch Code *</label>
                <input
                  type="text"
                  required
                  name="branchCode"
                  value={form.branchCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">City *</label>
                <input
                  type="text"
                  required
                  name="branchCity"
                  value={form.branchCity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Super Admin Account */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>5. Super Admin Access Credentials</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Super Admin Login Email</label>
                <input
                  type="email"
                  name="superAdminEmail"
                  placeholder="superadmin@apexhorizon.ai"
                  value={form.superAdminEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Defaults to corporate email if left blank</span>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Initial Password</label>
                <input
                  type="text"
                  required
                  name="superAdminPassword"
                  value={form.superAdminPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Default: password123</span>
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Enterprise in Database...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Register Enterprise Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
