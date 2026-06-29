import type { Metadata } from "next";
import { Geist, Tajawal } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LangProvider } from "@/lib/lang-context";
import ClientLayout from "./ClientLayout";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SkillForge — Learn Smarter, Build Your Career",
  description:
    "Free and open-source platform for learning roadmaps, certifications, courses, and career guidance. Everything you need in one place.",
  keywords: ["roadmap", "certifications", "courses", "career", "learning", "tech"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${geist.variable} ${tajawal.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0D1117] text-[#e6edf3]">
        <LangProvider>
          <ClientLayout>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </ClientLayout>
        </LangProvider>
      </body>
    </html>
  );
}
