'use client';

import { useState } from "react";
import Link from "next/link";

export default function LandingNavbar({ hasUser }: { hasUser: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-full mx-8 mt-4 mb-4 px-8 h-[72px] flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] fixed top-4 left-0 right-0 z-[100]">
        <div className="flex items-center gap-3 font-['Sora'] text-[1.4rem] font-bold text-[#0f172a] tracking-tight">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
            🩺
          </div>
          Med<span className="text-[#10b981]">Summary</span>
        </div>

        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          {["Features", "How it works", "Contact"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-[#4a5568] font-medium text-sm hover:text-[#10b981] transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          {!hasUser && (
            <Link href="/login" className="hidden md:block bg-transparent border-0 font-medium text-sm text-[#1a2340] hover:text-[#10b981] transition-colors">
              Login
            </Link>
          )}
          <Link href={hasUser ? "/upload" : "/signup"} className="bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white border-0 rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 hover:-translate-y-px transition-all inline-block">
            {hasUser ? "Dashboard" : "Sign Up"}
          </Link>
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1 border-0 bg-transparent p-2"
            onClick={() => setMobileOpen(true)}
          >
            <span className="block w-5 h-0.5 bg-[#1a2340] rounded-full"></span>
            <span className="block w-5 h-0.5 bg-[#1a2340] rounded-full"></span>
            <span className="block w-5 h-0.5 bg-[#1a2340] rounded-full"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[200] flex flex-col items-center justify-center gap-8">
          <button
            className="absolute top-6 right-6 text-3xl border-0 bg-transparent text-[#1a2340]"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>
          {["Features", "How it works", "Contact"].map((l) => (
            <a
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              key={l}
              className="text-2xl font-semibold text-[#1a2340]"
              onClick={() => setMobileOpen(false)}
            >
              {l}
            </a>
          ))}
          {!hasUser && (
            <Link href="/login" className="text-xl font-semibold text-[#1a2340]" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
          )}
          <Link href={hasUser ? "/upload" : "/signup"} className="mt-4 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-10 py-4 text-xl font-semibold shadow-lg" onClick={() => setMobileOpen(false)}>
            {hasUser ? "Dashboard" : "Sign Up"}
          </Link>
        </div>
      )}
    </>
  );
}
