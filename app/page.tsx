import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { UploadHomeClient } from "@/components/upload/UploadHomeClient";
import { Activity } from "lucide-react";

export default async function RootPage() {
  const user = await getProfile();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <DisclaimerBanner dismissable />

      <main className="flex-1">
        <UploadHomeClient />
      </main>

      <footer className="border-t bg-muted/30 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">MediSumm</span>
            <span>— AI-powered medical report summarizer</span>
          </div>
          <p className="text-center sm:text-right">
            For educational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
