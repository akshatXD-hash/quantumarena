import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { UploadPageClient } from "@/components/upload/UploadPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Report — MediSumm",
  description: "Upload your medical PDF report and get an instant plain-English AI summary.",
};

export default async function UploadPage() {
  const user = await getProfile();
  if (!user) redirect("/login");

  return (
    <div className="page-bg flex flex-col">
      <div className="page-blob-tl" />
      <div className="page-blob-br" />

      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <UploadPageClient />
      </main>

      <footer className="relative z-10 mx-8 mb-6 bg-white/50 backdrop-blur-lg border border-white/60 rounded-2xl py-4 px-4 text-center">
        <p className="text-xs text-[#5a7080]">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
}
