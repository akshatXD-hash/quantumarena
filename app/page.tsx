'use client'
import { useState } from "react";
import Link from "next/link";

const MedSummary = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      <div className="min-h-screen bg-[#f0f4f8] font-['DM_Sans'] text-[#1a2340]">
        {/* NAV */}
        <nav className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-full mx-8 mt-4 mb-4 px-8 h-[72px] flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] sticky top-4 z-[100]">
          <div className="flex items-center gap-3 font-['Sora'] text-[1.4rem] font-bold text-[#0f172a] tracking-tight">
            <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-100">
              🩺
            </div>
            Med<span className="text-[#3b82f6]">Summary</span>
          </div>

          <ul className="hidden md:flex gap-8 list-none">
            {["Features", "How it works", "About", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase().replace(/ /g, "-")}`} className="text-[#4a5568] font-medium text-sm hover:text-[#2ab8c8] transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-transparent border-0 font-medium text-sm text-[#1a2340] hover:text-[#2ab8c8] transition-colors">
              Login
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white border-0 rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 hover:-translate-y-px transition-all inline-block">
              Sign Up
            </Link>
            <button
              className="md:hidden flex flex-col gap-1"
              onClick={() => setMobileOpen(true)}
            >
              <span className="block w-5 h-0.5 bg-[#1a2340] rounded"></span>
              <span className="block w-5 h-0.5 bg-[#1a2340] rounded"></span>
              <span className="block w-5 h-0.5 bg-[#1a2340] rounded"></span>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center gap-8">
            <button
              className="absolute top-6 right-6 text-3xl"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
            {["Features", "How it works", "About", "Contact"].map((l) => (
              <a
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                key={l}
                className="text-2xl font-semibold text-[#1a2340]"
                onClick={() => setMobileOpen(false)}
              >
                {l}
              </a>
            ))}
            <Link href="/signup" className="mt-4 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-10 py-4 text-lg font-semibold" onClick={() => setMobileOpen(false)}>
              Sign Up
            </Link>
          </div>
        )}

        {/* HERO */}
        <section className="mx-8 rounded-3xl bg-gradient-to-br from-[#d6eef2] via-[#c5e6ef] to-[#d8eef6] py-20 px-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-7 bg-gradient-to-br from-[#2ab8c8] to-[#1fafc0] rounded-full flex items-center justify-center text-3xl shadow-[0_8px_24px_rgba(42,184,200,0.35)]">
            🩺
          </div>
          <h1 className="font-['Sora'] text-[2.75rem] md:text-5xl font-extrabold leading-tight text-[#1a2340] mb-5">
            Make sense of your<br />health today
          </h1>
          <p className="text-[#5a7080] text-lg max-w-md mx-auto mb-9 leading-relaxed">
            Sign up free and turn your next medical report into a summary you can actually understand.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="flex items-center gap-2 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-8 py-4 font-semibold shadow-[0_6px_20px_rgba(42,184,200,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(42,184,200,0.45)] transition-all">
              ↑ Upload Your First Report
            </Link>
            <Link href="/signup" className="flex items-center justify-center bg-white text-[#1a2340] rounded-full px-8 py-4 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all">
              Create Free Account
            </Link>
          </div>
          <p className="mt-6 text-xs text-[#7a9aab]">
            MedSummary is an educational tool — always consult a qualified healthcare professional for medical decisions.
          </p>
        </section>

        {/* FEATURE HERO (Split Layout) */}
        <section className="mx-8 rounded-3xl bg-white p-16 grid md:grid-cols-2 gap-12 items-center shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-5 py-2 text-sm font-semibold mb-6">
              ✦ AI-Powered Medical Summaries
            </div>
            <h2 className="font-['Sora'] text-4xl md:text-5xl font-extrabold leading-tight text-[#1a2340] mb-6">
              Understand Your<br />
              <span className="text-[#2ab8c8]">Medical Reports</span>
            </h2>
            <p className="text-[#4a5568] text-base leading-relaxed mb-8 max-w-md">
              Upload a PDF or image of your report and get a clear, patient-friendly summary with highlighted findings and next steps — in seconds.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/signup" className="flex items-center gap-2 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-8 py-4 font-semibold">
                ↑ Upload Report
              </Link>
              <a href="#how-it-works" className="flex items-center justify-center bg-white text-[#1a2340] rounded-full px-8 py-4 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                See How It Works →
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-[#5a7080] font-medium">
              <span>🛡 Private &amp; Secure</span>
              <span>✓ No medical jargon</span>
              <span>✓ PDF &amp; Image support</span>
            </div>
          </div>

          {/* Report Card */}
          <div>
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-6 border border-white shadow-[0_8px_40px_rgba(0,0,0,0.06)] relative">
              <div className="flex justify-between items-start mb-5 relative z-10">
                <span className="font-semibold text-sm text-[#1a2340]">Report Summary</span>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-md border border-white/50 rounded-lg px-3 py-1 text-xs font-semibold text-[#3b82f6]">
                    ✦ AI Summary
                  </div>
                  <span className="block text-[10px] text-[#3b82f6] mt-0.5">Simplified</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/50 shadow-sm relative z-10">
                <div className="uppercase text-[10px] font-bold tracking-widest text-[#94a3b8] mb-2">ORIGINAL</div>
                <p className="text-xs text-[#8a9aaa] line-through leading-relaxed">
                  "Patient presents with elevated LDL-C (162 mg/dL), borderline HbA1c 6.1%, mild hepatic steatosis on ultrasonography..."
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/50 shadow-sm relative z-10">
                <div className="uppercase text-[10px] font-bold tracking-widest text-[#2ab8c8] mb-2">PLAIN ENGLISH</div>
                <p className="text-sm text-[#1a2340] leading-relaxed">
                  Your <span className="bg-[#2ab8c8]/10 text-[#2ab8c8] px-1.5 py-0.5 rounded font-semibold border-b-2 border-[#2ab8c8]/30">cholesterol is high</span> and blood sugar is on the higher side. There are early signs of <span className="bg-[#2ab8c8]/10 text-[#2ab8c8] px-1.5 py-0.5 rounded font-semibold border-b-2 border-[#2ab8c8]/30">fatty liver</span>.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#eef8fa]/80 to-[#e4f4f7]/80 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/50 relative z-10">
                <div className="font-bold text-sm text-[#1a2340] mb-3">Next steps</div>
                <ul className="text-xs text-[#4a6070] space-y-1.5 pl-4 list-none">
                  <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-[#2ab8c8]">Consult a physician within 2 weeks</li>
                  <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-[#2ab8c8]">Reduce saturated fats &amp; added sugars</li>
                  <li className="relative before:content-['•'] before:absolute before:-left-4 before:text-[#2ab8c8]">Recheck lipid panel in 3 months</li>
                </ul>
              </div>

              <button className="w-full bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                ⬇ Download PDF Summary
              </button>
              <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-white/50 rounded-full px-4 py-1 text-xs text-[#5a7080] mt-3 shadow-sm relative z-10">
                🛡 HIPAA-aware
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="mx-8 my-6">
          <div className="text-center mb-12">
            <h2 className="font-['Sora'] text-4xl font-extrabold text-[#1a2340] mb-3">
              Everything to Decode Your <span className="text-[#2ab8c8]">Reports</span>
            </h2>
            <p className="text-[#4a5568] max-w-md mx-auto">
              A complete toolkit to help patients read, understand, and act on their medical information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "📤", title: "PDF & Image Upload", desc: "Drag and drop lab reports, scans, or prescriptions — we'll extract the text instantly with OCR." },
              { icon: "✦", title: "NLP Summarization", desc: "Advanced language models translate dense medical jargon into plain, patient-friendly language." },
              { icon: "✏️", title: "Key Findings Highlighted", desc: "Critical values, diagnoses, and abnormalities are visually emphasized so you don't miss what matters." },
              { icon: "→", title: "Suggested Next Steps", desc: "Get clear, actionable recommendations on what to ask your doctor and what to do next." },
              { icon: "🎤", title: "Voice-to-Text Input", desc: "Describe your symptoms or report verbally — we'll transcribe and analyze them for you." },
              { icon: "🛡", title: "Private & Secure", desc: "Your reports are encrypted and never shared. We prioritize accuracy and avoid medical misinterpretation." },
            ].map((f) => (
              <div key={f.title} className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/60 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300">
                <div className="w-12 h-12 bg-[#f0f4f8] rounded-2xl flex items-center justify-center text-3xl text-[#2ab8c8] mb-6">
                  {f.icon}
                </div>
                <h3 className="font-['Sora'] font-bold text-lg text-[#1a2340] mb-3">{f.title}</h3>
                <p className="text-sm text-[#4a5568] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-8 my-6">
          <div className="bg-white rounded-3xl py-16 px-10">
            <div className="text-center mb-12">
              <h2 className="font-['Sora'] text-4xl font-extrabold text-[#1a2340] mb-3">
                How It <span className="text-[#2ab8c8]">Works</span>
              </h2>
              <p className="text-[#4a5568]">Three simple steps from confusing report to clear understanding.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: "1", icon: "📤", title: "Upload your report", desc: "Drag and drop a PDF or image, or describe it using voice input." },
                { n: "2", icon: "✦", title: "AI analyzes & simplifies", desc: "Our NLP engine extracts findings and translates them into plain English." },
                { n: "3", icon: "📄", title: "Read your summary", desc: "Review highlighted insights, next steps, and download a clean PDF." },
              ].map((s) => (
                <div key={s.n} className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="absolute -top-3 left-8 w-9 h-9 bg-gradient-to-br from-[#2ab8c8] to-[#1a9aaa] rounded-full flex items-center justify-center text-white font-['Sora'] font-bold text-sm">
                    {s.n}
                  </div>
                  <div className="mt-8 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-3xl text-[#2ab8c8] shadow-sm mb-6">
                    {s.icon}
                  </div>
                  <h3 className="font-['Sora'] font-bold text-lg text-[#1a2340] mb-3">{s.title}</h3>
                  <p className="text-sm text-[#4a5568] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="about" className="mx-8 my-6">
          <div className="text-center mb-10">
            <h2 className="font-['Sora'] text-4xl font-extrabold text-[#1a2340]">
              Trusted by <span className="text-[#2ab8c8]">Patients &amp; Doctors</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { init: "P", name: "Priya S.", role: "Patient", text: "\"I finally understood my blood test results without Googling every term. MedSummary is a relief.\"" },
              { init: "D", name: "Dr. Anand K.", role: "Family Physician", text: "\"I recommend MedSummary to my patients so they come prepared with the right questions.\"" },
              { init: "M", name: "Maria L.", role: "Caregiver", text: "\"Helping my elderly mother understand her reports used to be stressful. Not anymore.\"" },
            ].map((t) => (
              <div key={t.name} className="bg-white/70 backdrop-blur-lg rounded-3xl p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-white/60 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300">
                <div className="text-[#2ab8c8] text-xl tracking-widest mb-4">★★★★★</div>
                <p className="italic text-[#4a5568] leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2ab8c8] to-[#1a9aaa] rounded-full flex items-center justify-center text-white font-['Sora'] font-bold">
                    {t.init}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-[#1a2340]">{t.name}</div>
                    <div className="text-xs text-[#8a9aaa]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-8 mb-10 bg-gradient-to-br from-[#d6eef2] via-[#c5e6ef] to-[#d8eef6] rounded-3xl py-20 px-10 text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-7 bg-gradient-to-br from-[#2ab8c8] to-[#1fafc0] rounded-full flex items-center justify-center text-3xl shadow-[0_8px_24px_rgba(42,184,200,0.35)]">
            🩺
          </div>
          <h2 className="font-['Sora'] text-4xl font-extrabold text-[#1a2340] mb-4">
            Make sense of your health today
          </h2>
          <p className="text-[#5a7080] max-w-md mx-auto mb-9 leading-relaxed">
            Sign up free and turn your next medical report into a summary you can actually understand.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/signup" className="flex items-center gap-2 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-8 py-4 font-semibold">
              ↑ Upload Your First Report
            </Link>
            <Link href="/signup" className="flex items-center justify-center bg-white text-[#1a2340] rounded-full px-8 py-4 font-semibold shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
              Create Free Account
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="mx-8 mb-6 bg-white/70 backdrop-blur-lg rounded-2xl px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.03)] border border-white/50 text-sm text-[#8a9aaa]">
          <div className="flex items-center gap-3 font-['Sora'] text-[1.2rem] font-bold text-[#0f172a] tracking-tight">
            <div className="w-8 h-8 bg-white rounded-[10px] flex items-center justify-center text-lg shadow-sm border border-slate-100">
              🩺
            </div>
            Med<span className="text-[#3b82f6]">Summary</span>
          </div>
          <span>© 2024 MedSummary. Clarity for every patient.</span>
        </footer>
      </div>
    </>
  );
};

export default MedSummary;