import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { ArrowRight, Brain, Shield, FileText, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const user = await getProfile();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      {/* Navigation Bar */}
      <nav className="w-full px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-background/50 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl backdrop-blur-md border border-primary/20">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            MediSumm
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/upload">
              <Button variant="default" className="rounded-full px-6 group transition-all duration-300 shadow-[0_0_20px_-5px_hsl(var(--primary))]">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="rounded-full px-6 hover:bg-white/5">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="default" className="rounded-full px-6 group transition-all duration-300 shadow-[0_0_20px_-5px_hsl(var(--primary))]">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-32 text-center z-10">
        <Badge />
        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground !leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700">
          Understand Your Medical Reports in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Plain English</span>.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          Upload complex clinical lab results and let our advanced AI translate them instantly into clear, actionable summaries anyone can understand.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link href={user ? "/upload" : "/signup"}>
            <Button size="lg" className="rounded-full px-8 h-14 text-base font-medium shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:shadow-[0_0_40px_-5px_hsl(var(--primary))] transition-all group">
              {user ? "Go to Dashboard" : "Start Translating Now"}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <FeatureCard 
            icon={<FileText className="h-6 w-6 text-emerald-400" />}
            title="Instant PDF Parsing"
            desc="Drag and drop any lab report PDF. Our engine securely extracts the text in milliseconds."
          />
          <FeatureCard 
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="Grade-8 English"
            desc="Our medical AI breaks down dense jargon into simple, actionable summaries and next steps."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6 text-purple-400" />}
            title="Private & Secure"
            desc="Your medical data is temporary and encrypted. We never train public models on your health records."
          />
        </div>
      </main>
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="text-sm font-medium text-foreground/80 tracking-wide uppercase">AI-Powered Clarification</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-start p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
      <div className="p-3 rounded-xl bg-background/50 border border-white/5 mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-foreground tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-left leading-relaxed">{desc}</p>
    </div>
  );
}
