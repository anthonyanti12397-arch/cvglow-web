'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.')
      setLoading(false)
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    // Demo mode: store in sessionStorage
    try {
      const user = { id: 'demo-user-001', email: form.email, full_name: form.name, subscription_status: 'free' }
      sessionStorage.setItem('cvglow_user', JSON.stringify(user))
      await new Promise(r => setTimeout(r, 800))
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #f0f4ff 0%, #fff 100%)"}}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" style={{background: "linear-gradient(135deg, #0A1628, #0A1628)"}}>
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">CV</span>
            </div>
            <span className="text-2xl font-bold">CVGlow</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Build your perfect resume today</h2>
          <p className="text-slate-200 text-lg leading-relaxed mb-8">
            Join thousands of professionals who&apos;ve landed their dream jobs using CVGlow.
          </p>
          <div className="space-y-4">
            {[
              { icon: "⚡", text: "Real-time preview as you type" },
              { icon: "📄", text: "Professional PDF export" },
              { icon: "🔒", text: "Secure cloud storage" },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #0A1628, #0A1628)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">CVGlow</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8">Start building your professional resume today.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Chen"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{"--tw-ring-color": "#0A1628"} as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="alex@email.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60 mt-2"
              style={{background: loading ? "#4a6080" : "#0A1628"}}
            >
              {loading ? 'Creating account...' : 'Create Account — Free'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium" style={{color: "#0A1628"}}>
              Sign in
            </Link>
          </p>

          <p className="text-center text-gray-400 text-xs mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
