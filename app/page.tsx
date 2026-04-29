import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white" style={{fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"}}>

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{background: "linear-gradient(135deg, #0A1628, #1a3a6b)"}}>
              <span className="text-white font-bold text-xs tracking-tight">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">CVGlow</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full ml-1" style={{background: "#fff3cd", color: "#92610a"}}>Beta</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/ats" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block transition-colors">Free ATS Check</Link>
            <Link href="/templates" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden md:block transition-colors">Templates</Link>
            <Link href="/pricing" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden lg:block transition-colors">Pricing</Link>
            <Link href="/auth/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap" style={{background: "#0A1628"}}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-8" style={{borderColor: "#e2e8f0", color: "#64748b"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Built for Hong Kong job seekers
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
            Your AI job hunt{" "}
            <span style={{background: "linear-gradient(90deg, #0A1628, #FF6B5B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              copilot
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed">
            Build a targeted resume, generate a cover letter, and check your ATS score — all in one place. Made for the HK job market.
          </p>
          <p className="text-sm text-gray-400 mb-10">We're early. We're building this with you.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="text-white font-semibold px-8 py-4 rounded-xl text-base transition-all shadow-lg hover:shadow-xl" style={{background: "#0A1628"}}>
              Build My Resume — Free
            </Link>
            <Link href="/resume/demo/preview" className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl text-base transition-colors hover:border-gray-400">
              See a Demo
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card · Free forever plan</p>

          {/* Free ATS CTA */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
            <span className="text-sm text-gray-500">Not sure if your resume will pass ATS?</span>
            <Link href="/ats" className="text-sm font-semibold flex items-center gap-1.5 transition-colors" style={{color: "#FF6B5B"}}>
              Check for free →
            </Link>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border shadow-2xl" style={{borderColor: "#e2e8f0"}}>
            {/* Browser chrome */}
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 max-w-sm mx-auto text-center border">
                  cvglow-web.vercel.app/resume/edit
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2" style={{background: "linear-gradient(135deg, #f8fafc, #fff)"}}>
              {/* Editor */}
              <div className="p-6 border-r border-gray-100">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Resume Editor</div>
                <div className="space-y-3">
                  {[
                    {label: "Full Name", value: "Alex Chan"},
                    {label: "Job Title", value: "Senior Product Manager"},
                    {label: "Target Role", value: "Head of Product @ FinTech"},
                  ].map(f => (
                    <div key={f.label} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                      <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                      <div className="text-sm text-gray-700">{f.value}</div>
                    </div>
                  ))}
                  <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-400 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Product Strategy", "Data Analysis", "Agile", "SQL"].map(s => (
                        <span key={s} className="text-xs px-2 py-1 rounded-md font-medium" style={{background: "#f1f5f9", color: "#475569"}}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Preview updating live
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-6">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Live Preview</div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 text-left">
                  <div className="border-b border-gray-100 pb-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Alex Chan</h3>
                    <p className="text-sm font-medium" style={{color: "#FF6B5B"}}>Senior Product Manager</p>
                    <p className="text-xs text-gray-400 mt-1">alex@email.com · Hong Kong</p>
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Experience</div>
                    <div className="text-sm font-semibold text-gray-800">Hang Seng Bank</div>
                    <div className="text-xs text-gray-400">Senior PM · 2022 – Present</div>
                    <div className="text-xs text-gray-500 mt-1">Led digital banking transformation serving 3.8M users.</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {["Product Strategy", "Data Analysis", "Agile"].map(s => (
                        <span key={s} className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5 rounded border border-gray-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features — no emoji */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Everything for your job hunt</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Not just a resume builder. A full toolkit for landing the job.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "ATS Score Check",
                desc: "See if your resume will pass automated screening — before you apply. Get a score and specific keywords to add.",
                tag: "Core Feature",
                tagColor: "#FF6B5B",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Screenshot to Resume",
                desc: "See a job on JobsDB or LinkedIn? Screenshot it. We extract the requirements and tailor your resume automatically.",
                tag: "AI-Powered",
                tagColor: "#0A1628",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Cover Letter AI",
                desc: "Generate a personalised cover letter for each job in seconds. Based on your resume and the actual job requirements.",
                tag: "New",
                tagColor: "#059669",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
                title: "Multiple Templates",
                desc: "Tech, Finance, Creative, Executive — pick a template designed for your industry. Not just one generic format.",
                tag: "Updated",
                tagColor: "#7c3aed",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                ),
                title: "Share Link",
                desc: "Get a live link to your resume — no PDF needed. See who viewed it. Update it anytime without resending.",
                tag: "Coming Soon",
                tagColor: "#94a3b8",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "Application Tracker",
                desc: "Track every application in one place. Applied, interviewing, offer, rejected — know your pipeline at a glance.",
                tag: "Coming Soon",
                tagColor: "#94a3b8",
              },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background: "#f1f5f9", color: "#475569"}}>
                    {f.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{background: `${f.tagColor}15`, color: f.tagColor}}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof — honest */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-8">We're early. Here's what we've shipped.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {stat: "AI-Powered", label: "Resume customisation from any job screenshot"},
              {stat: "Free Forever", label: "Core features stay free. No bait-and-switch."},
              {stat: "HK-First", label: "Built by and for Hong Kong job seekers"},
            ].map(s => (
              <div key={s.stat}>
                <div className="text-2xl font-bold text-gray-900 mb-1">{s.stat}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Simple pricing</h2>
          <p className="text-gray-500 mb-12">Start free. Upgrade if you want more.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left hover:border-gray-300 transition-colors">
              <div className="font-bold text-gray-900 text-lg mb-1">Free</div>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <div className="text-sm text-gray-400 mb-6">forever</div>
              <ul className="space-y-2.5 text-sm text-gray-600 mb-8">
                {[
                  "1 resume",
                  "All templates",
                  "ATS Score check",
                  "AI customisation",
                  "PDF download (ad-supported)",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-400 transition-colors">
                Get Started
              </Link>
            </div>

            <div className="rounded-2xl p-8 text-left text-white relative overflow-hidden" style={{background: "linear-gradient(135deg, #0A1628, #1a3a6b)"}}>
              <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full" style={{background: "#FF6B5B"}}>Pro</div>
              <div className="font-bold text-blue-200 text-lg mb-1">Premium</div>
              <div className="text-4xl font-bold mb-1">$3.99</div>
              <div className="text-sm text-blue-300 mb-6">per month</div>
              <ul className="space-y-2.5 text-sm text-blue-100 mb-8">
                {[
                  "Unlimited resumes",
                  "Cover Letter AI",
                  "Ad-free downloads",
                  "Resume share link",
                  "Application tracker",
                  "Priority support",
                ].map(f => (
                  <li key={f} className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-blue-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center bg-white font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors" style={{color: "#0A1628"}}>
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4" style={{background: "#0A1628"}}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Start your job hunt today.</h2>
          <p className="text-blue-300 mb-8">No templates. No tricks. Just a tool that helps you get hired.</p>
          <Link href="/auth/signup" className="inline-block font-bold px-8 py-4 rounded-xl text-base shadow-lg transition-colors" style={{background: "#FF6B5B", color: "white"}}>
            Build My Resume — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: "#060d1a"}} className="py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{background: "#1a3a6b"}}>
              <span className="text-white font-bold text-xs">CV</span>
            </div>
            <span className="text-white font-semibold">CVGlow</span>
            <span className="text-blue-800 text-xs ml-1">Beta</span>
          </div>
          <p className="text-gray-600 text-sm">© 2026 CVGlow. Built in Hong Kong.</p>
          <div className="flex gap-5 text-gray-600 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
