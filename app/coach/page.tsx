'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import EarnCreditsModal from '@/components/EarnCreditsModal'
import { canUseFeature, deductCredits, getRemainingCredits, CREDIT_COSTS } from '@/lib/usage'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_PROMPTS = [
  'How do I improve my ATS score?',
  'What salary should I ask for as a Software Engineer in HK?',
  'How do I answer "Tell me about yourself"?',
  'How to cold message a recruiter on LinkedIn?',
  'What are common Finance interview questions in HK?',
  'How do I explain a gap in my resume?',
]

const WELCOME = `Hi! I'm your AI Career Coach, built for the Hong Kong job market 🇭🇰

I can help you with:
- **Resume & ATS** — keywords, formatting, what recruiters look for
- **Salaries** — HK market rates by industry and level
- **Interviews** — prep, STAR method, common HK employer questions
- **Job search** — JobsDB, LinkedIn, agency vs direct, networking

What's on your mind?`

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState(0)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const refreshCredits = useCallback(() => {
    setCredits(getRemainingCredits())
  }, [])

  useEffect(() => {
    refreshCredits()
  }, [refreshCredits])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isPremium = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('cvglow_user') || '{}')
      return user.subscription_status === 'premium'
    } catch { return false }
  }

  const doSend = async (text: string) => {
    if (!text.trim() || loading) return

    const isLoggedIn = !!sessionStorage.getItem('cvglow_user')
    if (!isLoggedIn) {
      setMessages(prev => [...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: '🔒 Please [sign in](/auth/login) to use the AI Career Coach.' }
      ])
      return
    }

    // Deduct credit
    const ok = deductCredits('coach_message')
    if (!ok) {
      // Not enough credits — show ad modal
      setPendingMessage(text)
      setShowAdModal(true)
      return
    }
    refreshCredits()

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, try again.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setLoading(false)
      refreshCredits()
    }
  }

  const handleAdEarned = () => {
    setShowAdModal(false)
    refreshCredits()
    if (pendingMessage) {
      doSend(pendingMessage)
      setPendingMessage('')
    }
  }

  const renderContent = (content: string) => {
    return content
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="underline text-blue-600">$1</a>')
      .replace(/\n/g, '<br/>')
  }

  const premium = isPremium()
  const cost = CREDIT_COSTS.coach_message

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shrink-0">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{background: 'linear-gradient(135deg, #0A1628, #1a3a6b)'}}>
                🎯
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">AI Career Coach</div>
                <div className="text-xs text-gray-400">Powered by Grok 4 · HK specialist</div>
              </div>
            </div>
          </div>
          {!premium && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                ⚡ {credits === Infinity ? '∞' : credits} credits
              </span>
              <Link href="/pricing" className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{borderColor: '#0A1628', color: '#0A1628'}}>
                Upgrade
              </Link>
            </div>
          )}
          {premium && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{background: '#f0f4ff', color: '#0A1628'}}>✨ Premium</span>
          )}
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1" style={{background: '#0A1628'}}>
                  🎯
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                }`}
                style={msg.role === 'user' ? {background: '#0A1628'} : {}}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0" style={{background: '#0A1628'}}>
                🎯
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">Try asking:</p>
            <div className="flex gap-2 flex-wrap">
              {QUICK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => doSend(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {!premium && (
            <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
              <span>Each message costs {cost} credit</span>
              <button
                onClick={() => { setPendingMessage(''); setShowAdModal(true) }}
                className="text-[#0A1628] font-medium hover:underline"
              >
                Watch ad for +5 credits →
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && doSend(input)}
              placeholder="Ask your career question..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
              disabled={loading}
            />
            <button
              onClick={() => doSend(input)}
              disabled={!input.trim() || loading}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-40 transition-opacity"
              style={{background: '#0A1628'}}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <EarnCreditsModal
        isOpen={showAdModal}
        featureName="AI Coach message"
        creditCost={cost}
        onEarned={handleAdEarned}
        onClose={() => { setShowAdModal(false); setPendingMessage('') }}
      />
    </div>
  )
}
