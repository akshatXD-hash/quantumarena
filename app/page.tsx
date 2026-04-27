import Link from "next/link";
import { getProfile } from "@/lib/auth";
import LandingNavbar from "@/components/LandingNavbar";

export default async function LandingPage() {
  const user = await getProfile();

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <LandingNavbar hasUser={!!user} />

      {/* NEW UI Section */}
      <main className="flex-1 font-['DM_Sans'] text-[#1a2340] bg-[#f0f4f8] pt-32 pb-10 w-full z-10 flex flex-col gap-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
          html { scroll-behavior: smooth; }
        `}</style>


        {/* FEATURE HERO (Split Layout) */}
        <section className="mx-8 mt-6 rounded-3xl bg-white p-16 grid md:grid-cols-2 gap-12 items-center shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
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
              <Link href={user ? "/upload" : "/signup"} className="flex items-center gap-2 bg-gradient-to-r from-[#2ab8c8] to-[#1a9aaa] text-white rounded-full px-8 py-4 font-semibold">
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
          <div className="bg-white rounded-3xl py-16 px-10 border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="text-center mb-20">
              <h2 className="font-['Sora'] text-4xl font-extrabold text-[#1a2340] mb-3">
                How It <span className="text-[#2ab8c8]">Works</span>
              </h2>
              <p className="text-[#4a5568]">Follow the flow from a confusing report to clear understanding.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 relative w-full max-w-5xl mx-auto pb-8">

              {/* Step 1 */}
              <div className="flex-1 flex flex-col items-center text-center relative w-full group">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2ab8c8] to-[#1fafc0] rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-[#2ab8c8]/30 mb-6 border-4 border-white transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 relative z-10">
                  📤
                </div>
                {/* Arrow 1 to 2 */}
                <div className="absolute top-10 left-[65%] w-[70%] hidden md:block opacity-40 z-0">
                  <svg viewBox="0 0 100 20" className="w-full h-12 text-[#2ab8c8] overflow-visible" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M 0,10 C 30,-15 70,-15 100,10" strokeDasharray="5 5" />
                    <path d="M 90,4 L 100,10 L 90,16" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-['Sora'] font-bold text-xl text-[#1a2340] mb-3">1. Upload Report</h3>
                <p className="text-sm text-[#4a5568] px-4 max-w-[250px]">Drag and drop a PDF or image, or describe it using voice input.</p>
              </div>

              {/* Step 2 */}
              <div className="flex-1 flex flex-col items-center text-center relative w-full group mt-12 md:mt-20">
                <div className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-[#10b981]/30 mb-6 border-4 border-white transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative z-10">
                  ✦
                </div>
                {/* Arrow 2 to 3 */}
                <div className="absolute top-10 left-[65%] w-[70%] hidden md:block opacity-40 z-0">
                  <svg viewBox="0 0 100 20" className="w-full h-12 text-[#10b981] overflow-visible" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M 0,10 C 30,35 70,35 100,10" strokeDasharray="5 5" />
                    <path d="M 90,4 L 100,10 L 90,16" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-['Sora'] font-bold text-xl text-[#1a2340] mb-3">2. AI Simplifies</h3>
                <p className="text-sm text-[#4a5568] px-4 max-w-[250px]">Our NLP engine extracts findings and translates jargon into plain English.</p>
              </div>

              {/* Step 3 */}
              <div className="flex-1 flex flex-col items-center text-center relative w-full group mt-12 md:mt-0">
                <div className="w-24 h-24 bg-gradient-to-br from-[#3b82f6] to-[#2563eb] rounded-[2rem] flex items-center justify-center text-4xl shadow-xl shadow-[#3b82f6]/30 mb-6 border-4 border-white transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 relative z-10">
                  📄
                </div>
                <h3 className="font-['Sora'] font-bold text-xl text-[#1a2340] mb-3">3. Review Summary</h3>
                <p className="text-sm text-[#4a5568] px-4 max-w-[250px]">Read highlighted insights, next steps, and download a clean PDF.</p>
              </div>

            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" className="mx-8 mb-6 bg-[#10b981] text-white/90 rounded-3xl px-12 py-10 shadow-[0_8px_32px_rgba(16,185,129,0.3)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-medium text-sm">
            <div className="flex items-center gap-3 font-['Sora'] text-xl font-bold text-white tracking-tight">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                <span role="img" aria-label="stethoscope" className="text-[#10b981]">🩺</span>
              </div>
              MedSummary
            </div>

            <span>© {new Date().getFullYear()} MedSummary. Clarity for every patient.</span>

            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
