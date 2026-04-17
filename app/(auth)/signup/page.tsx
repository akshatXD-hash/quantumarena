"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2,
  Stethoscope, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "PATIENT" | "ADMIN";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [role, setRole] = useState<Role>("PATIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setError("");
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        name: form.name || undefined,
        role,
      }),
    });

    const data = (await res.json()) as { error?: string | Record<string, string[]> };

    if (!res.ok) {
      setLoading(false);
      if (typeof data.error === "string") {
        setError(data.error);
      } else {
        setError(Object.values(data.error ?? {}).flat().join(" "));
      }
      return;
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created — please sign in.");
      router.push("/login");
      return;
    }

    // Redirect based on role
    router.push(role === "ADMIN" ? "/admin" : "/upload");
    router.refresh();
  }

  const strength =
    form.password.length >= 12 ? "strong"
    : form.password.length >= 8 ? "good"
    : form.password.length > 0 ? "weak"
    : null;

  const strengthColor =
    strength === "strong" ? "bg-green-500"
    : strength === "good" ? "bg-amber-400"
    : "bg-destructive";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">MediSumm</h1>
          </div>
          <p className="text-muted-foreground">Understand your medical reports in plain English</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1">Free to join — no credit card needed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="space-y-2">
              <Label>I am signing up as</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("PATIENT")}
                  className={[
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium",
                    role === "PATIENT"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/30",
                  ].join(" ")}
                >
                  <Stethoscope className="h-5 w-5" />
                  Patient
                  <span className="text-[10px] font-normal opacity-70">Upload & view reports</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={[
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-sm font-medium",
                    role === "ADMIN"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/30",
                  ].join(" ")}
                >
                  <ShieldCheck className="h-5 w-5" />
                  Admin
                  <span className="text-[10px] font-normal opacity-70">Manage all patients</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full name <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={set("name")}
                  className="pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set("email")}
                  className="pl-9"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set("password")}
                  className="pl-9 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {strength && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {["weak", "good", "strong"].map((level, i) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          (strength === "weak" && i === 0) ||
                          (strength === "good" && i <= 1) ||
                          strength === "strong"
                            ? strengthColor
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${
                    strength === "weak" ? "text-destructive" :
                    strength === "good" ? "text-amber-600" : "text-green-600"
                  }`}>{strength}</span>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  className="pl-9 pr-10"
                  required
                  disabled={loading}
                />
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account…" : `Create ${role === "ADMIN" ? "Admin" : "Patient"} Account`}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
          <strong>Medical disclaimer:</strong> MediSumm is for educational purposes only and does
          not provide medical advice, diagnosis, or treatment.
        </p>
      </div>
    </div>
  );
}
