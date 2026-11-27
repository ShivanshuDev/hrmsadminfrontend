"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Loader2, KeyRound, Sparkles, AlertCircle } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("superadmin@weardynamite.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Invalid Super Admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password123");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">DYNAMITE HRMS</h1>
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">Super Admin Portal Gateway</p>
          <p className="text-xs text-slate-400">Authenticating directly against Supabase PostgreSQL and MongoDB Atlas.</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl flex items-center space-x-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@weardynamite.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Access Key / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            <span>{loading ? "Authenticating..." : "Authenticate as Super Admin"}</span>
          </button>
        </form>

        {/* Quick Credentials */}
        <div className="pt-4 border-t border-slate-800">
          <p className="text-[11px] text-slate-400 text-center mb-2 font-medium">Quick Fill Live Database Credentials:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill("superadmin@weardynamite.com")}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-left transition-colors truncate"
            >
              <span className="block font-semibold text-indigo-400 truncate">Wear Dynamite</span>
              <span className="text-[10px] text-slate-400">superadmin@weardynamite...</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill("superadmin@apexcloud.com")}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-left transition-colors truncate"
            >
              <span className="block font-semibold text-emerald-400 truncate">Apex Global Cloud</span>
              <span className="text-[10px] text-slate-400">superadmin@apexcloud...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
