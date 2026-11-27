import { Company } from "./company";
import { Announcement } from "./notification";

export interface InfrastructureStatus {
  relationalSQL: string;
  noSQLDocument: string;
  inMemoryCache: string;
  status: "healthy" | "degraded" | "offline";
  timestamp: string;
  latencyMs?: number;
}

export interface PlatformMetrics {
  totalCompanies: number;
  totalBranches: number;
  totalEmployees: number;
  totalAnnouncements: number;
  activeCompanies: number;
  totalPayrollBudget: number;
  sectorBreakdown: Record<string, number>;
  recentCompanies: Company[];
  recentAnnouncements: Announcement[];
}
