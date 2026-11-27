export interface Announcement {
  _id: string;
  id?: string;
  title: string;
  content: string;
  category: "Policy" | "Facility" | "Culture" | "Benefits" | "Emergency";
  author: string;
  priority: "low" | "medium" | "high";
  date: number;
  isActive: boolean;
  companyId?: string;
  companyName?: string;
  createdAt?: string | number;
}

export interface AuditLog {
  _id: string;
  userName: string;
  userEmail: string;
  action: string;
  module: string;
  companyId?: string;
  createdAt: number | string;
}
