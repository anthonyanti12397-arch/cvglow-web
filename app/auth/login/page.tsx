'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      setLoading(false)
      return
    }

    try {
      const user = { id: 'demo-user-001', email: form.email, full_name: 'Demo User', subscription_status: 'free' }
      sessionStorage.setItem('cvglow_user', JSON.stringify(user))
      await new Promise(r => setTimeout(r, 700))
      router.push('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{background: "linear-gradient(135deg, #f8f7ff 0%, #fff 100%)"}}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" style={{background: "linear-gradient(135deg, #8239f5, #6d1ee8)"}}>
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold">CV</span>
            </div>
            <span className="text-2xl font-bold">CVGlow</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">Welcome back!</h2>
          <p className="text-purple-100 text-lg leading-relaxed">
            Continue building your professional resume and land your dream job.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #8f5ff7, #6d1ee8)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">CVGlow</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-500 mb-8">Welcome back to CVGlow.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-medium" style={{color: "#8239f5"}}>Forgot password?</a>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
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
              style={{background: loading ? "#a785ff" : "#8239f5"}}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium" style={{color: "#8239f5"}}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
