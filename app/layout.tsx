import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Dynamite HRMS - Super Admin Platform",
  description: "Global Multi-Tenant Enterprise Administration & Workforce Telemetry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <Sidebar />
        <div className="pl-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 pt-16 p-8 bg-slate-950 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
