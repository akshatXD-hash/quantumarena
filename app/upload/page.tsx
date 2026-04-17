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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <UploadPageClient />
      </main>

      <footer className="border-t bg-muted/30 py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          For educational purposes only. Not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
}
