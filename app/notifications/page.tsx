"use client";

import React, { useEffect, useState } from "react";
import { Bell, Search, AlertCircle, ShieldAlert, CheckCircle, Clock, Building2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Announcement } from "@/types/notification";
import { formatDate } from "@/lib/utils";

export default function NotificationsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true);
      const data = await adminService.getNotifications();
      setAnnouncements(data);
      setLoading(false);
    }
    loadNotifications();
  }, []);

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      selectedPriority === "all" || a.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-950/80 text-rose-400 border-rose-800/40";
      case "medium":
        return "bg-amber-950/80 text-amber-400 border-amber-800/40";
      case "low":
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Corporate Broadcasts & Notices</h1>
          <p className="text-sm text-slate-400">
            Real-time company announcements, policy updates, and emergency notices from MongoDB Atlas.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
            Broadcasts: <strong className="text-indigo-400">{announcements.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search announcement subject, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
          >
            <option value="all">All Priorities</option>
            <option value="high">High / Urgent</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements Feed */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading broadcast communications from MongoDB Atlas...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
          No announcements found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                      <span>Author: <strong className="text-slate-300">{item.author}</strong></span>
                      <span>Category: <strong className="text-indigo-400">{item.category}</strong></span>
                      <span>Date: {formatDate(item.date || item.createdAt || Date.now())}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`self-start px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getPriorityBadge(
                    item.priority
                  )}`}
                >
                  {item.priority} Priority
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800/60 mt-3 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
