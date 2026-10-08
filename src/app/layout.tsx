import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import MedicalDisclaimer from "@/components/layout/MedicalDisclaimer";

export const metadata: Metadata = {
  title: "FitMind AI | Production AI Fitness & Nutrition Coach",
  description: "Personalized AI-powered biometrics engine, diet planner, workout splits, and real-time Coach AI chat assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen flex flex-col antialiased selection:bg-nutrition-500 selection:text-slate-950">
        <MedicalDisclaimer />
        <div className="flex flex-1 min-h-screen relative">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
            <Header />
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
