import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg shrink-0" style={{background: "linear-gradient(135deg, #8f5ff7, #6d1ee8)"}}>
              <span className="text-white font-bold text-sm flex items-center justify-center h-full">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">CVGlow</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden sm:block">Pricing</Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Sign In</Link>
            <Link href="/auth/signup" className="text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap" style={{background: "#8239f5"}}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6" style={{background: "#f8f7ff", color: "#6d1ee8"}}>
            <span className="w-2 h-2 rounded-full" style={{background: "#8239f5"}}></span>
            Trusted by 10,000+ job seekers
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Professional Resume,{" "}
            <span style={{background: "linear-gradient(90deg, #8239f5, #a785ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
              Zero Hassle
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Build a stunning resume in minutes. Real-time preview, beautiful templates, and one-click PDF export. Land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all" style={{background: "#8239f5"}}>
              Create My Resume — Free
            </Link>
            <Link href="/resume/demo/preview" className="border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors hover:border-gray-300">
              See Example Resume
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required · Free forever plan available</p>
        </div>
      </section>

      {/* Resume Preview Mockup */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl p-5 sm:p-8 border shadow-xl" style={{background: "linear-gradient(135deg, #f8f7ff, #fff)", borderColor: "#dcd5ff"}}>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Form side */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Resume Editor</div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-400 mb-1">Full Name</div>
                  <div className="h-8 bg-gray-50 rounded-md border border-gray-200 flex items-center px-3 text-sm text-gray-600">Alex Chen</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-400 mb-1">Job Title</div>
                  <div className="h-8 bg-gray-50 rounded-md border border-gray-200 flex items-center px-3 text-sm text-gray-600">Senior Software Engineer</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="text-xs text-gray-400 mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {["React", "TypeScript", "Node.js", "AWS"].map(s => (
                      <span key={s} className="text-xs px-2 py-1 rounded-md" style={{background: "#f8f7ff", color: "#6d1ee8"}}>{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium" style={{color: "#8239f5"}}>
                  <span className="w-2 h-2 rounded-full" style={{background: "#8239f5"}}></span>
                  Live preview updating...
                </div>
              </div>

              {/* Preview side */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-left">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Alex Chen</h3>
                  <p className="font-medium" style={{color: "#8239f5"}}>Senior Software Engineer</p>
                  <p className="text-gray-500 text-sm mt-1">alex@email.com · +1 (555) 123-4567</p>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Experience</div>
                  <div className="text-sm font-semibold text-gray-800">TechCorp Inc.</div>
                  <div className="text-xs text-gray-500">Senior Software Engineer · 2021 – Present</div>
                  <div className="text-xs text-gray-600 mt-1">Led development of microservices architecture serving 2M+ users.</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {["React", "TypeScript", "Node.js", "AWS"].map(s => (
                      <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to get hired</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No design skills needed. Just fill in your details and watch your resume come to life.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Real-time Preview", desc: "See your resume update instantly as you type. No more guessing what it'll look like." },
              { icon: "📄", title: "1-Click PDF Export", desc: "Download a print-ready PDF instantly. ATS-friendly format that gets past automated screeners." },
              { icon: "🔒", title: "Saved to Cloud", desc: "Your resumes are saved securely. Access and edit them from any device, anytime." },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple, honest pricing</h2>
          <p className="text-gray-500 mb-10">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left">
              <div className="font-semibold text-gray-900 text-lg mb-1">Free</div>
              <div className="text-3xl font-bold text-gray-900 mb-4">$0<span className="text-base font-normal text-gray-400">/mo</span></div>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                {["1 resume", "Basic template", "PDF download", "Ad-supported"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-500">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg hover:border-gray-300 transition-colors">
                Get Started
              </Link>
            </div>
            <div className="rounded-2xl p-8 text-left text-white relative overflow-hidden" style={{background: "linear-gradient(135deg, #8239f5, #6d1ee8)"}}>
              <div className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full" style={{background: "rgba(255,255,255,0.2)"}}>Popular</div>
              <div className="font-semibold text-purple-100 text-lg mb-1">Premium</div>
              <div className="text-3xl font-bold mb-4">$3.99<span className="text-base font-normal text-purple-200">/mo</span></div>
              <ul className="space-y-2 text-sm text-purple-100 mb-6">
                {["Unlimited resumes", "Multiple templates", "Ad-free", "Priority support"].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-white">✓</span>{f}</li>
                ))}
              </ul>
              <Link href="/pricing" className="block text-center bg-white font-semibold py-2.5 rounded-lg hover:bg-purple-50 transition-colors" style={{color: "#6d1ee8"}}>
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{background: "linear-gradient(135deg, #8239f5, #6d1ee8)"}}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to glow up your career?</h2>
          <p className="text-purple-100 mb-8">Join thousands of professionals who landed their dream jobs with CVGlow.</p>
          <Link href="/auth/signup" className="inline-block bg-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:bg-purple-50 transition-colors" style={{color: "#6d1ee8"}}>
            Create My Resume — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{background: "linear-gradient(135deg, #8f5ff7, #6d1ee8)"}}>
              <span className="text-white font-bold text-xs">CV</span>
            </div>
            <span className="text-white font-semibold">CVGlow</span>
          </div>
          <p className="text-gray-500 text-sm">© 2025 CVGlow. All rights reserved.</p>
          <div className="flex gap-4 text-gray-500 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
