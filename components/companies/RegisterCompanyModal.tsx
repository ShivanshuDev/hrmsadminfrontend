"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Globe,
  Mail,
  Phone,
  Clock,
  Users,
  Image as ImageIcon,
  Trash2,
  UploadCloud,
  ChevronRight,
  ChevronLeft,
  FileCheck,
  Check,
  Copy,
  KeyRound,
  ShieldCheck,
  Edit3,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { getAllSectors, getCategoriesForSector } from "@/data/businessSectors";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface BoardMember {
  name: string;
  designation: string;
}

interface BranchItem {
  id: string;
  branchCompanyId: string;
  branchName: string;
  branchCode: string;
  branchType: string;
  isHeadquarters: boolean;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  gstin?: string;
  branchHeadName?: string;
}

const STEPS = [
  { step: 1, title: "1. Identity", label: "Legal Identity", icon: Building2 },
  { step: 2, title: "2. Leadership", label: "Executive Governance", icon: Users },
  { step: 3, title: "3. Operations", label: "Hours & Rules", icon: Clock },
  { step: 4, title: "4. Media", label: "Logo & Facility Photos", icon: ImageIcon },
  { step: 5, title: "5. Branches", label: "Branch Network", icon: MapPin },
  { step: 6, title: "6. Review & Sign", label: "Audit & Certification", icon: ShieldCheck },
];

export function RegisterCompanyModal({ isOpen, onClose, onSuccess }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Registered credentials modal
  const [registeredData, setRegisteredData] = useState<{
    companyName: string;
    companyId: string;
    superAdminEmail: string;
    superAdminPassword: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Dynamic Sectors & categories
  const allSectors = getAllSectors();
  const [selectedSector, setSelectedSector] = useState(allSectors[0]?.name || "");
  const [selectedCategory, setSelectedCategory] = useState(allSectors[0]?.categories[0] || "");

  // Step 1: Legal Identity (100% Dynamic - Clean Empty States)
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [address, setAddress] = useState("");

  // Step 2: Executive Leadership (100% Dynamic - Clean Empty States)
  const [directorName, setDirectorName] = useState("");
  const [ceoName, setCeoName] = useState("");
  const [ctoName, setCtoName] = useState("");
  const [cooName, setCooName] = useState("");
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([
    { name: "", designation: "" },
  ]);

  // Step 3: Operations & Rules (100% Dynamic - Clean Empty States)
  const [timing, setTiming] = useState("");
  const [description, setDescription] = useState("");
  const [rulesRegulations, setRulesRegulations] = useState("");

  // Step 4: Visual Media (100% Dynamic - Clean Empty States)
  const [companyLogo, setCompanyLogo] = useState("");
  const [companyImages, setCompanyImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);

  // Step 5: Multi-Branch Network (100% Dynamic - Clean Empty States)
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: "branch-hq-01",
      branchCompanyId: "",
      branchName: "",
      branchCode: "",
      branchType: "headquarters",
      isHeadquarters: true,
      address: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      phone: "",
      email: "",
      gstin: "",
      branchHeadName: "",
    },
  ]);

  // Step 6: Super Admin Custom Credentials (Clean Empty State)
  const [superAdminEmail, setSuperAdminEmail] = useState("");
  const [superAdminPassword, setSuperAdminPassword] = useState("");

  // Compliance Checkboxes
  const [agreeRules, setAgreeRules] = useState(false);
  const [agreeStatutory, setAgreeStatutory] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAuth, setAgreeAuth] = useState(false);

  if (!isOpen) return null;

  const availableCategories = getCategoriesForSector(selectedSector);

  const handleSectorChange = (newSector: string) => {
    setSelectedSector(newSector);
    const cats = getCategoriesForSector(newSector);
    if (cats.length > 0) setSelectedCategory(cats[0]);
  };

  // Image Upload Handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCompanyLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFacilityUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const readers: Promise<string>[] = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(readers).then((urls) => {
      setCompanyImages((prev) => [...prev, ...urls]);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setCompanyImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  };

  const handleRemoveImage = (index: number) => {
    setCompanyImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Board Member Handlers
  const handleAddBoardMember = () => {
    setBoardMembers((prev) => [...prev, { name: "", designation: "" }]);
  };

  const handleRemoveBoardMember = (index: number) => {
    if (boardMembers.length <= 1) return;
    setBoardMembers((prev) => prev.filter((_, i) => i !== index));
  };

  // Branch Handlers
  const handleAddBranch = () => {
    const num = branches.length + 1;
    setBranches((prev) => [
      ...prev,
      {
        id: `branch-${Date.now()}`,
        branchCompanyId: "",
        branchName: "",
        branchCode: "",
        branchType: "branch",
        isHeadquarters: false,
        address: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        phone: "",
        email: "",
        gstin: "",
        branchHeadName: "",
      },
    ]);
  };

  const handleRemoveBranch = (index: number) => {
    if (branches.length <= 1) return;
    setBranches((prev) => prev.filter((_, i) => i !== index));
  };

  // Step Validation before Proceeding
  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!companyName.trim()) {
        setError("Company Legal Name is required");
        return false;
      }
      if (!gstNumber.trim() || gstNumber.trim().length !== 15) {
        setError("Valid 15-character GSTIN is required");
        return false;
      }
      if (!panNumber.trim() || panNumber.trim().length !== 10) {
        setError("Valid 10-character PAN number is required");
        return false;
      }
      if (!mobileNumber.trim()) {
        setError("Corporate contact mobile/phone is required");
        return false;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Valid corporate email address is required");
        return false;
      }
      if (!websiteLink.trim()) {
        setError("Corporate website URL is required");
        return false;
      }
      if (!address.trim()) {
        setError("Headquarters street address is required");
        return false;
      }
    } else if (step === 2) {
      if (!directorName.trim()) {
        setError("Managing Director name is required");
        return false;
      }
      if (!ceoName.trim()) {
        setError("CEO name is required");
        return false;
      }
      if (!ctoName.trim()) {
        setError("CTO name is required");
        return false;
      }
      if (!cooName.trim()) {
        setError("COO name is required");
        return false;
      }
      if (boardMembers.length === 0 || !boardMembers[0].name.trim() || !boardMembers[0].designation.trim()) {
        setError("At least 1 board member with name and designation is required");
        return false;
      }
    } else if (step === 3) {
      if (!timing.trim()) {
        setError("Shift timing and operating hours are required");
        return false;
      }
      if (!description.trim() || description.trim().length < 20) {
        setError("Company description must be at least 20 characters");
        return false;
      }
      if (!rulesRegulations.trim() || rulesRegulations.trim().length < 20) {
        setError("Rules & regulations must be at least 20 characters");
        return false;
      }
    } else if (step === 4) {
      if (!companyLogo.trim()) {
        setError("Company Logo is required (Upload file or enter image URL)");
        return false;
      }
      if (companyImages.length < 5) {
        setError(`At least 5 facility photos required (Currently: ${companyImages.length})`);
        return false;
      }
    } else if (step === 5) {
      if (branches.length === 0) {
        setError("At least 1 branch (Headquarters) is required");
        return false;
      }
      const hq = branches[0];
      if (!hq.branchName.trim() || !hq.branchCode.trim() || !hq.city.trim() || !hq.state.trim() || !hq.phone.trim()) {
        setError("Please complete all required fields for Primary Headquarters");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!superAdminPassword.trim() || superAdminPassword.trim().length < 6) {
      setError("Please set a secure Super Admin password (minimum 6 characters).");
      return;
    }
    if (!agreeRules || !agreeStatutory || !agreeTerms || !agreeAuth) {
      setError("Please check and accept all 4 statutory and compliance certifications to proceed.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const targetAdminEmail = (superAdminEmail.trim() || email.trim()).toLowerCase();
      const payload = {
        companyName: companyName.trim(),
        businessSector: selectedSector,
        businessCategory: selectedCategory,
        gstNumber: gstNumber.trim().toUpperCase(),
        panNumber: panNumber.trim().toUpperCase(),
        registrationNumber: registrationNumber.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim().toLowerCase(),
        websiteLink: websiteLink.trim(),
        address: address.trim(),
        companyLogo: companyLogo.trim(),
        companyImages: companyImages,
        directorName: directorName.trim(),
        ceoName: ceoName.trim(),
        ctoName: ctoName.trim(),
        cooName: cooName.trim(),
        boardMembers: boardMembers.filter((b) => b.name.trim()),
        timing: timing.trim(),
        description: description.trim(),
        rulesRegulations: rulesRegulations.trim(),
        superAdminEmail: targetAdminEmail,
        superAdminPassword: superAdminPassword.trim(),
        branches: branches.map((b, index) => ({
          id: b.id || `branch-${Date.now()}-${index}`,
          code: b.branchCode.trim().toUpperCase(),
          name: b.branchName.trim(),
          branchType: b.branchType,
          isHq: b.isHeadquarters,
          address: b.address.trim() || address.trim(),
          city: b.city.trim(),
          state: b.state.trim(),
          country: b.country || "India",
          postalCode: b.postalCode.trim(),
          phone: b.phone.trim(),
          email: b.email.trim() || email.trim(),
          gstin: b.gstin?.trim() || gstNumber.trim(),
          branchHeadName: b.branchHeadName?.trim() || directorName.trim(),
        })),
      };

      const res = await adminService.registerCompany(payload);
      const companyResult = res?.data?.company || res?.company || {};
      const creds = res?.data?.superAdmin || res?.superAdmin || {};

      setRegisteredData({
        companyName: companyResult.companyName || companyName,
        companyId: companyResult.id || companyResult._id || `comp-${Date.now()}`,
        superAdminEmail: creds.email || payload.superAdminEmail,
        superAdminPassword: creds.password || payload.superAdminPassword,
      });

      onSuccess();
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err?.response?.data?.message || err?.message || "Registration failed. Verify all mandatory enterprise fields.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Executive Header Banner */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-purple-50/50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                  Enterprise Incorporator
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  Direct Live Database Provisioning
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                Register New Enterprise Entity
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] gap-2">
            {STEPS.map((s) => {
              const isActive = currentStep === s.step;
              const isPast = currentStep > s.step;
              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => {
                    if (s.step < currentStep || validateStep(currentStep)) {
                      setCurrentStep(s.step);
                    }
                  }}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                      : isPast
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/70"
                      : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                      isActive
                        ? "bg-white text-indigo-600"
                        : isPast
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                  </div>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center space-x-2.5 text-rose-600 dark:text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Registered Credentials Revealed */}
          {registeredData ? (
            <div className="p-6 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  Incorporation Successful
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {registeredData.companyName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Corporate entity successfully provisioned into MongoDB Atlas and Root Super Admin credentials generated in PostgreSQL.
                </p>
              </div>

              {/* Credentials Card */}
              <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 text-left space-y-3.5">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <KeyRound className="w-4 h-4" />
                  <span>Super Admin Root Access Credentials</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Company ID</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{registeredData.companyId}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Super Admin Email</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{registeredData.superAdminEmail}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(registeredData.superAdminEmail, "email")}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Root Password</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{registeredData.superAdminPassword}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(registeredData.superAdminPassword, "password")}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                    >
                      {copiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setRegisteredData(null);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Done & Return to Enterprise Registry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Legal Identity & Statutory Incorporation */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Building2 className="w-4 h-4" />
                    <span>Legal Identity & Operating Industry Classification</span>
                  </div>

                  {/* Dynamic Sector Selector */}
                  <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Adaptive Sector Configuration ({allSectors.length} Sectors Available)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Type of Business Sector *</label>
                        <select
                          value={selectedSector}
                          onChange={(e) => handleSectorChange(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                        >
                          {allSectors.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name} ({s.categories.length} categories)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">Industry Specialization / Category *</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold"
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Primary Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Company Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter full registered corporate name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">15-Digit GSTIN *</label>
                      <input
                        type="text"
                        required
                        maxLength={15}
                        value={gstNumber}
                        onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. 29AAAAA0000A1Z5"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">10-Digit Company PAN *</label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        placeholder="e.g. AAAAA0000A"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Registration Number / CIN (Optional)</label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder="e.g. U72200KA2026PTC000000"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Official Mobile / Phone *</label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="e.g. +91 98000 00000"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Official Corporate Email *</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="corporate@yourcompany.com"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Corporate Website URL *</label>
                      <div className="relative">
                        <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          required
                          value={websiteLink}
                          onChange={(e) => setWebsiteLink(e.target.value)}
                          placeholder="https://yourcompany.com"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Headquarters Address *</label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Street, Building, Area, City, State - PIN"
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Executive Leadership & Governance */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Users className="w-4 h-4" />
                    <span>Executive Leadership & Board of Governance</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Managing Director (MD) Name *</label>
                      <input
                        type="text"
                        required
                        value={directorName}
                        onChange={(e) => setDirectorName(e.target.value)}
                        placeholder="Enter Managing Director's name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Chief Executive Officer (CEO) *</label>
                      <input
                        type="text"
                        required
                        value={ceoName}
                        onChange={(e) => setCeoName(e.target.value)}
                        placeholder="Enter Chief Executive Officer's name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Chief Technology Officer (CTO) *</label>
                      <input
                        type="text"
                        required
                        value={ctoName}
                        onChange={(e) => setCtoName(e.target.value)}
                        placeholder="Enter Chief Technology Officer's name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Chief Operating Officer (COO) *</label>
                      <input
                        type="text"
                        required
                        value={cooName}
                        onChange={(e) => setCooName(e.target.value)}
                        placeholder="Enter Chief Operating Officer's name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Board Members Table */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                          Board of Directors Roster *
                        </span>
                        <p className="text-[10px] text-slate-400">At least 1 board member required</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddBoardMember}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Member</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {boardMembers.map((member, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Full Legal Name"
                            value={member.name}
                            onChange={(e) => {
                              const updated = [...boardMembers];
                              updated[idx].name = e.target.value;
                              setBoardMembers(updated);
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Board Designation"
                            value={member.designation}
                            onChange={(e) => {
                              const updated = [...boardMembers];
                              updated[idx].designation = e.target.value;
                              setBoardMembers(updated);
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                          />
                          {boardMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBoardMember(idx)}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Operations & Regulations */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4" />
                    <span>Operational Timings, Enterprise Description & Governance Rules</span>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Operating Timings & Shift Hours *
                      </label>
                      <input
                        type="text"
                        required
                        value={timing}
                        onChange={(e) => setTiming(e.target.value)}
                        placeholder="e.g. 09:30 AM - 06:30 PM (Mon-Fri) | 40 Hours Flexible"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Company Profile & Overview Description *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter a detailed overview of company operations, vision, and core industry..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[10px] text-slate-400">Min 20 characters</span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Company Rules, Regulations & Employment Policies *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={rulesRegulations}
                        onChange={(e) => setRulesRegulations(e.target.value)}
                        placeholder="Enter workplace code of conduct, non-disclosure agreements, attendance policies, and compliance norms..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-[10px] text-slate-400">Min 20 characters</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Visual Brand Media & Facility Gallery */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <ImageIcon className="w-4 h-4" />
                      <span>Visual Identity & Workplace Gallery (Minimum 5 Images Required)</span>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        companyImages.length >= 5
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {companyImages.length} / 5 Images {companyImages.length >= 5 ? "✓ Validated" : "(Need at least 5)"}
                    </span>
                  </div>

                  {/* 1. Logo */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Company Official Brand Logo *</label>
                      <button
                        type="button"
                        onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {showLogoUrlInput ? "Use File Upload" : "Or enter Image URL"}
                      </button>
                    </div>

                    {companyLogo ? (
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <img
                            src={companyLogo}
                            alt="Logo preview"
                            className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                              Corporate Logo Ready
                            </span>
                            <span className="text-[10px] text-emerald-500 font-semibold flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Ready for Database Persistence</span>
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCompanyLogo("")}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : showLogoUrlInput ? (
                      <input
                        type="url"
                        placeholder="Paste image URL (https://...)"
                        value={companyLogo}
                        onChange={(e) => setCompanyLogo(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer hover:bg-indigo-50/60 transition-colors">
                        <UploadCloud className="w-8 h-8 text-indigo-500 mb-1" />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Click to Upload Corporate Logo
                        </span>
                        <span className="text-[10px] text-slate-400">PNG, JPG, SVG or WebP</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    )}
                  </div>

                  {/* 2. Facility Gallery */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Facility & Workplace Gallery Images (Min 5) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowImageUrlInput(!showImageUrlInput)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {showImageUrlInput ? "Use File Upload" : "Or enter URL"}
                      </button>
                    </div>

                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-200 dark:border-indigo-900 rounded-2xl bg-indigo-50/30 dark:bg-indigo-950/20 cursor-pointer hover:bg-indigo-50/60 transition-colors">
                      <UploadCloud className="w-8 h-8 text-indigo-500 mb-1" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Select Workplace & Campus Photos
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Upload 5 or more photos (Offices, Reception, Boardrooms, Facilities)
                      </span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFacilityUpload} />
                    </label>

                    {showImageUrlInput && (
                      <div className="flex space-x-2 text-xs">
                        <input
                          type="url"
                          placeholder="Paste image URL (https://...)"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* Preview Gallery Grid */}
                    {companyImages.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            Attached Gallery ({companyImages.length} Photos)
                          </span>
                          <button
                            type="button"
                            onClick={() => setCompanyImages([])}
                            className="text-[10px] text-rose-500 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {companyImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800"
                            >
                              <img src={img} alt={`Facility ${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="p-1 rounded-lg bg-rose-600 text-white hover:bg-rose-500"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: Multi-Branch Network */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <MapPin className="w-4 h-4" />
                      <span>Corporate Multi-Branch Network ({branches.length} Configured)</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBranch}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Additional Branch</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {branches.map((b, idx) => (
                      <div
                        key={b.id || idx}
                        className={`p-4 rounded-2xl border text-xs space-y-3 ${
                          b.isHeadquarters
                            ? "bg-indigo-50/30 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/60"
                            : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 dark:text-white">
                              {b.branchName || `Branch #${idx + 1}`}
                            </span>
                            {b.isHeadquarters ? (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                                ★ Global Headquarters
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-semibold uppercase">
                                {b.branchType}
                              </span>
                            )}
                          </div>

                          {!b.isHeadquarters && branches.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBranch(idx)}
                              className="text-rose-500 hover:text-rose-600 text-[11px] flex items-center space-x-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Company ID *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. BR-001"
                              value={b.branchCompanyId}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].branchCompanyId = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-indigo-600 dark:text-indigo-400 font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="Branch office title"
                              value={b.branchName}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].branchName = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Code *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. HQ-01"
                              value={b.branchCode}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].branchCode = e.target.value.toUpperCase();
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono uppercase"
                            />
                          </div>

                          <div className="space-y-1 sm:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Street Address *</label>
                            <input
                              type="text"
                              required
                              placeholder="Branch physical address"
                              value={b.address}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].address = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">City *</label>
                            <input
                              type="text"
                              required
                              placeholder="City"
                              value={b.city}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].city = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">State *</label>
                            <input
                              type="text"
                              required
                              placeholder="State / Province"
                              value={b.state}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].state = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Postal Code</label>
                            <input
                              type="text"
                              placeholder="PIN / Postal Code"
                              value={b.postalCode}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].postalCode = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Contact Phone *</label>
                            <input
                              type="text"
                              required
                              placeholder="Branch contact phone"
                              value={b.phone}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].phone = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Branch Head Name</label>
                            <input
                              type="text"
                              placeholder="Branch manager name"
                              value={b.branchHeadName || ""}
                              onChange={(e) => {
                                const up = [...branches];
                                up[idx].branchHeadName = e.target.value;
                                setBranches(up);
                              }}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Review, Agreement Acceptance & Statutory Certification */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Review Registration Dossier & Legal Certification</span>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Identity Snapshot */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Corporate Identity</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-3">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt="Logo"
                            className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 dark:border-slate-700 p-1 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{companyName || "—"}</span>
                          <span className="text-[10px] text-indigo-500 font-semibold">{selectedSector} • {selectedCategory}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">GSTIN:</span>
                          <span className="font-mono font-bold">{gstNumber || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">PAN:</span>
                          <span className="font-mono font-bold">{panNumber || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Email:</span>
                          <span>{email || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Website:</span>
                          <span className="text-indigo-500">{websiteLink || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Leadership Snapshot */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Executive Leadership</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">MD</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{directorName || "—"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">CEO</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{ceoName || "—"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">CTO</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{ctoName || "—"}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">COO</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{cooName || "—"}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Board Members: {boardMembers.map((b) => b.name).filter(Boolean).join(", ") || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Super Admin Credentials Configuration */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Root Super Admin Credentials Configuration</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Super Admin Login Email *</label>
                        <input
                          type="email"
                          required
                          placeholder={email || "superadmin@domain.com"}
                          value={superAdminEmail}
                          onChange={(e) => setSuperAdminEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                        />
                        <span className="text-[10px] text-slate-400">Defaults to corporate email ({email || "..."}) if empty</span>
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300">Initial Password * (Min 6 chars)</label>
                        <input
                          type="password"
                          required
                          placeholder="Enter a secure root password"
                          value={superAdminPassword}
                          onChange={(e) => setSuperAdminPassword(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4 Mandatory Legal & Compliance Checkboxes */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase flex items-center space-x-1.5">
                      <FileCheck className="w-4 h-4 text-indigo-500" />
                      <span>Statutory Agreement & Compliance Certifications (4 Mandatory Sign-Offs)</span>
                    </span>

                    <div className="space-y-2.5">
                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeRules}
                          onChange={(e) => setAgreeRules(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Rule 1 • Operational Governance Acceptance:</strong> I have reviewed and agree to adopt and enforce the stated Company Rules, Regulations, and Operating Standards across all corporate branches and workforce members.
                        </span>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeStatutory}
                          onChange={(e) => setAgreeStatutory(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Rule 2 • Statutory Identity Certification:</strong> I certify under legal penalty that the corporate identity ({companyName || "Company"}), 15-digit GSTIN ({gstNumber || "GSTIN"}), 10-digit PAN ({panNumber || "PAN"}), and registered address are authentic, legally incorporated, and valid.
                        </span>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Rule 3 • Master Enterprise Agreement:</strong> I accept the Dynamite HRMS Enterprise Master Services Agreement, Data Security Protocol, Multi-Branch Data Isolation Standards, and Automatic System Audit Trail Logging.
                        </span>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeAuth}
                          onChange={(e) => setAgreeAuth(e.target.checked)}
                          className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">
                          <strong>Rule 4 • Super Admin Access Authorization:</strong> I authorize the generation of Root Super Admin credentials and direct database provisioning in MongoDB Atlas and Supabase PostgreSQL.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={currentStep === 1 ? onClose : handlePrev}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? "Cancel" : "Previous Step"}</span>
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !agreeRules || !agreeStatutory || !agreeTerms || !agreeAuth}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Provisioning Enterprise in Database...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Provision Enterprise Now</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
