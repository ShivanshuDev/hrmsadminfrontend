import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

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
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <Sidebar />
          <div className="pl-64 flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-16 p-8 min-h-screen transition-colors duration-200">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
