'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Resume } from '@/lib/types'
import EarnCreditsModal from '@/components/EarnCreditsModal'
import { deductCredits, CREDIT_COSTS } from '@/lib/usage'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
  feedback?: string
  score?: number
  ts: number
}

const DEMO_RESUME = {
  fullName: 'Alex Chen',
  jobTitle: 'Senior Software Engineer',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 123-4567',
  summary: 'Experienced software engineer with 5+ years building scalable web applications.',
  experiences: [{ company: 'TechCorp Inc.', position: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Led development of microservices architecture.' }],
  educations: [{ school: 'UC Berkeley', degree: 'Bachelor', field: 'Computer Science', graduateYear: '2019' }],
  skills: ['TypeScript', 'React', 'Node.js', 'AWS'],
}

export default function InterviewPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [jobTitle, setJobTitle] = useState('')
  const [started, setStarted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [turnCount, setTurnCount] = useState(0)
  const [sessionEnded, setSessionEnded] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingAnswer, setPendingAnswer] = useState('')

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    setResumes(stored)
    if (stored.length > 0) setSelectedId(stored[0].id)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getResumeContent = () => {
    if (!selectedId) return DEMO_RESUME
    const found = resumes.find(r => r.id === selectedId)
    return found ? found.content : DEMO_RESUME
  }

  const startInterview = async () => {
    if (!jobTitle.trim()) return
    setStarted(true)
    setLoading(true)
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: getResumeContent(),
          jobTitle: jobTitle.trim(),
          history: [],
          candidateAnswer: '',
        }),
      })
      const data = await res.json()
      setMessages([{ role: 'interviewer', content: data.question, ts: Date.now() }])
      setTurnCount(1)
    } catch {
      setMessages([{ role: 'interviewer', content: 'Hello! Tell me about yourself and why you\'re interested in this role.', ts: Date.now() }])
      setTurnCount(1)
    } finally {
      setLoading(false)
    }
  }

  const sendAnswer = async () => {
    const answer = input.trim()
    if (!answer || loading) return

    if (!deductCredits('interview_turn')) {
      setPendingAnswer(answer)
      setShowAdModal(true)
      return
    }

    setInput('')

    const candidateMsg: Message = { role: 'candidate', content: answer, ts: Date.now() }
    const newMessages = [...messages, candidateMsg]
    setMessages(newMessages)
    setLoading(true)

    const history = newMessages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: getResumeContent(),
          jobTitle: jobTitle.trim(),
          history: history.slice(0, -1), // exclude last candidate msg, sent separately
          candidateAnswer: answer,
        }),
      })
      const data = await res.json()
      const newTurn = turnCount + 1

      const interviewerMsg: Message = {
        role: 'interviewer',
        content: data.question,
        feedback: data.feedback,
        score: data.score,
        ts: Date.now(),
      }
      setMessages(prev => [...prev, interviewerMsg])
      setTurnCount(newTurn)

      // End after 8 interviewer turns
      if (newTurn >= 8) setSessionEnded(true)
    } catch {
      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: 'Good answer. What would you say is your biggest professional achievement?',
        ts: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const avgScore = messages
    .filter(m => m.score !== undefined)
    .reduce((sum, m, _, arr) => sum + (m.score ?? 0) / arr.length, 0)

  const scoreColor = (s: number) => s >= 8 ? '#059669' : s >= 6 ? '#d97706' : '#dc2626'

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
            <span className="font-bold text-gray-900">Interview Simulator</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#fef9c3', color: '#854d0e' }}>Beta</span>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: '#f0fdf4' }}>
                🎤
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Interview</h1>
              <p className="text-gray-500 text-sm">AI-powered practice with real-time feedback on your answers.</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Target Job Title</label>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startInterview()}
                  placeholder="e.g. Product Manager, Frontend Engineer"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
                />
              </div>

              {resumes.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Your Resume</label>
                  <select
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400"
                  >
                    {resumes.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                    <option value="">Demo Resume</option>
                  </select>
                </div>
              )}

              <button
                onClick={startInterview}
                disabled={!jobTitle.trim()}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-opacity"
                style={{ background: '#0A1628' }}
              >
                Start Interview →
              </button>

              <div className="text-xs text-gray-400 text-center">
                ~8 questions · AI evaluates each answer · No data stored
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EarnCreditsModal
        isOpen={showAdModal}
        featureName="Interview turn"
        creditCost={CREDIT_COSTS.interview_turn}
        onEarned={() => {
          setShowAdModal(false)
          if (pendingAnswer) {
            setInput(pendingAnswer)
            setPendingAnswer('')
            // re-trigger send after a tick
            setTimeout(() => sendAnswer(), 50)
          }
        }}
        onClose={() => { setShowAdModal(false); setPendingAnswer('') }}
      />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
            <div>
              <div className="font-bold text-gray-900 text-sm">{jobTitle}</div>
              <div className="text-xs text-gray-400">Turn {turnCount} of 8</div>
            </div>
          </div>
          {turnCount > 1 && (
            <div className="text-right">
              <div className="text-xs text-gray-400">Avg score</div>
              <div className="text-lg font-bold" style={{ color: scoreColor(avgScore) }}>{avgScore.toFixed(1)}/10</div>
            </div>
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full transition-all duration-500" style={{ width: `${(turnCount / 8) * 100}%`, background: '#0A1628' }} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${msg.role === 'interviewer' ? 'text-white' : 'bg-gray-200 text-gray-600'}`}
              style={msg.role === 'interviewer' ? { background: '#0A1628' } : {}}>
              {msg.role === 'interviewer' ? '🎤' : '👤'}
            </div>

            <div className={`max-w-[80%] space-y-2 ${msg.role === 'candidate' ? 'items-end flex flex-col' : ''}`}>
              {/* Feedback (above candidate messages only, shown on interviewer's next turn) */}
              {msg.role === 'interviewer' && msg.feedback && (
                <div className="px-3 py-2 rounded-xl text-xs border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-semibold" style={{ color: '#059669' }}>Feedback</span>
                    {msg.score !== undefined && (
                      <span className="font-bold ml-auto" style={{ color: scoreColor(msg.score) }}>{msg.score}/10</span>
                    )}
                  </div>
                  <span style={{ color: '#166534' }}>{msg.feedback}</span>
                </div>
              )}

              {/* Message bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'interviewer'
                  ? 'bg-white border border-gray-100 text-gray-900'
                  : 'text-white'
              }`} style={msg.role === 'candidate' ? { background: '#0A1628' } : {}}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white shrink-0" style={{ background: '#0A1628' }}>🎤</div>
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {sessionEnded && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">🎉</div>
            <div className="font-bold text-gray-900 mb-1">Interview Complete!</div>
            <div className="text-sm text-gray-500 mb-4">Your average score: <span className="font-bold" style={{ color: scoreColor(avgScore) }}>{avgScore.toFixed(1)}/10</span></div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => { setMessages([]); setStarted(false); setTurnCount(0); setSessionEnded(false) }}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#0A1628' }}>
                Practice Again
              </button>
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!sessionEnded && (
        <div className="bg-white border-t border-gray-200 sticky bottom-0">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAnswer() } }}
                placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
                rows={2}
                disabled={loading || messages.length === 0}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 resize-none disabled:opacity-50"
              />
              <button
                onClick={sendAnswer}
                disabled={loading || !input.trim() || messages.length === 0}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-50 transition-opacity self-end"
                style={{ background: '#0A1628' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
