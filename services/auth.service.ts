import { apiClient } from "./api";

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
  companyName?: string;
  avatar?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: SuperAdminUser }> {
    const res = await apiClient.post("/auth/login", {
      email,
      password,
    });

    const data = res.data?.data;
    if (data?.token && data?.user) {
      const role = (data.user.role || "").toLowerCase();
      // Enforce that only platform administrators can access HRMS Admin
      if (role !== "platform_admin" && role !== "super_admin") {
        throw new Error(
          "Access Restricted: This portal is exclusively reserved for Platform Super Administrators. Tenant and company employees must sign in via the Client HRMS Portal."
        );
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("hrms_superadmin_token", data.token);
        localStorage.setItem("hrms_superadmin_user", JSON.stringify(data.user));
      }
      return data;
    }
    throw new Error("Invalid response from server");
  },

  getCurrentUser(): SuperAdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const str = localStorage.getItem("hrms_superadmin_user");
      return str ? JSON.parse(str) : null;
    } catch {
      return null;
    }
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hrms_superadmin_token");
      localStorage.removeItem("hrms_superadmin_user");
      window.location.href = "/login";
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("hrms_superadmin_token");
  },
};
