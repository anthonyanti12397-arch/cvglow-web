'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type Status = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected'

interface Application {
  id: string
  job_title: string
  company: string
  location?: string
  salary?: string
  source?: string
  url?: string
  status: Status
  applied_date?: string
  notes?: string
  resume_id?: string
  created_at: string
  updated_at: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  saved:     { label: 'Saved',        color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' },
  applied:   { label: 'Applied',      color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  interview: { label: 'Interviewing', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  offer:     { label: 'Offer',        color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
  rejected:  { label: 'Rejected',     color: '#dc2626', bg: '#fff5f5', border: '#fecaca' },
}

const COLUMNS: Status[] = ['saved', 'applied', 'interview', 'offer', 'rejected']

const EMPTY: Application = {
  id: '', job_title: '', company: '', location: '', salary: '',
  source: '', url: '', status: 'saved', applied_date: '',
  notes: '', resume_id: '', created_at: '', updated_at: '',
}

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [form, setForm] = useState<Application>(EMPTY)
  const [filter, setFilter] = useState<Status | 'all'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('cvglow_tracker')
    if (stored) setApps(JSON.parse(stored))
  }, [])

  function save(list: Application[]) {
    setApps(list)
    localStorage.setItem('cvglow_tracker', JSON.stringify(list))
  }

  function openNew() {
    setForm({ ...EMPTY, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    setEditing(null)
    setShowForm(true)
  }

  function openEdit(app: Application) {
    setForm({ ...app })
    setEditing(app)
    setShowForm(true)
  }

  function submit() {
    if (!form.job_title || !form.company) return
    const now = new Date().toISOString()
    if (editing) {
      save(apps.map(a => a.id === editing.id ? { ...form, updated_at: now } : a))
    } else {
      save([{ ...form, created_at: now, updated_at: now }, ...apps])
    }
    setShowForm(false)
  }

  function deleteApp(id: string) {
    if (confirm('Remove this application?')) save(apps.filter(a => a.id !== id))
  }

  function moveStatus(app: Application, status: Status) {
    save(apps.map(a => a.id === app.id ? { ...a, status, updated_at: new Date().toISOString() } : a))
  }

  const filtered = apps.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const matchSearch = !search || a.job_title.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const byStatus = (status: Status) => filtered.filter(a => a.status === status)

  const stats = COLUMNS.map(s => ({ status: s, count: apps.filter(a => a.status === s).length }))

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">←</Link>
            <span className="font-bold text-gray-900">Application Tracker</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f0fdf4', color: '#059669' }}>{apps.length} total</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search roles..."
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 w-44"
            />
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ background: '#0A1628' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {stats.map(({ status, count }) => {
            const cfg = STATUS_CONFIG[status]
            return (
              <button
                key={status}
                onClick={() => setFilter(filter === status ? 'all' : status)}
                className="p-3 rounded-xl border text-left transition-all hover:shadow-sm"
                style={{
                  background: filter === status ? cfg.bg : 'white',
                  borderColor: filter === status ? cfg.border : '#e2e8f0',
                }}
              >
                <div className="text-2xl font-bold mb-0.5" style={{ color: cfg.color }}>{count}</div>
                <div className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</div>
              </button>
            )
          })}
        </div>

        {/* Kanban board */}
        {apps.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#f1f5f9' }}>
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-semibold text-gray-500 mb-2">No applications yet</p>
            <p className="text-sm text-gray-400 mb-6">Add your first application to start tracking your job hunt.</p>
            <button onClick={openNew} className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: '#0A1628' }}>
              Add First Application
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {COLUMNS.map(status => {
              const cfg = STATUS_CONFIG[status]
              const items = byStatus(status)
              return (
                <div key={status} className="flex flex-col">
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-1 mb-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="ml-auto text-xs font-semibold text-gray-400">{items.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-2 min-h-[200px]">
                    {items.map(app => (
                      <div
                        key={app.id}
                        className="bg-white border rounded-xl p-3.5 cursor-pointer hover:shadow-md transition-all group"
                        style={{ borderColor: '#e2e8f0' }}
                        onClick={() => openEdit(app)}
                      >
                        <div className="font-semibold text-gray-900 text-sm mb-0.5 leading-tight">{app.job_title}</div>
                        <div className="text-xs text-gray-500 mb-2">{app.company}</div>

                        {app.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {app.location}
                          </div>
                        )}
                        {app.salary && (
                          <div className="text-xs font-medium mt-1" style={{ color: '#059669' }}>{app.salary}</div>
                        )}
                        {app.applied_date && (
                          <div className="text-xs text-gray-300 mt-2">Applied {new Date(app.applied_date).toLocaleDateString('en-HK', { day: 'numeric', month: 'short' })}</div>
                        )}

                        {/* Quick move buttons */}
                        <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          {COLUMNS.filter(s => s !== status).slice(0, 2).map(s => (
                            <button
                              key={s}
                              onClick={() => moveStatus(app, s)}
                              className="text-xs px-2 py-1 rounded-md border font-medium transition-colors hover:shadow-sm"
                              style={{ borderColor: STATUS_CONFIG[s].border, color: STATUS_CONFIG[s].color, background: STATUS_CONFIG[s].bg }}
                            >
                              → {STATUS_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Add to this column */}
                    <button
                      onClick={() => { setForm({ ...EMPTY, id: Date.now().toString(), status, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }); setEditing(null); setShowForm(true) }}
                      className="w-full py-2 rounded-xl border-2 border-dashed text-xs font-medium transition-colors hover:border-gray-400"
                      style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}
                    >
                      + Add here
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{editing ? 'Edit Application' : 'Add Application'}</h2>
              <div className="flex gap-2">
                {editing && (
                  <button onClick={() => { deleteApp(editing.id); setShowForm(false) }} className="text-xs px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Delete</button>
                )}
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {([
                { key: 'job_title', label: 'Job Title *', placeholder: 'e.g. Senior Product Manager' },
                { key: 'company', label: 'Company *', placeholder: 'e.g. HSBC, Cathay Pacific' },
                { key: 'location', label: 'Location', placeholder: 'e.g. Central, Hong Kong' },
                { key: 'salary', label: 'Salary Range', placeholder: 'e.g. HK$35K–50K/month' },
                { key: 'source', label: 'Found on', placeholder: 'e.g. JobsDB, LinkedIn, Referral' },
                { key: 'url', label: 'Job URL', placeholder: 'https://...' },
                { key: 'applied_date', label: 'Date Applied', placeholder: '', type: 'date' },
              ] as const).map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">{f.label}</label>
                  <input
                    type={(f as any).type || 'text'}
                    value={(form as any)[f.key] || ''}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Status</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {COLUMNS.map(s => {
                    const cfg = STATUS_CONFIG[s]
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, status: s }))}
                        className="py-2 rounded-lg text-xs font-semibold border transition-all"
                        style={{
                          background: form.status === s ? cfg.bg : 'white',
                          borderColor: form.status === s ? cfg.border : '#e2e8f0',
                          color: form.status === s ? cfg.color : '#94a3b8',
                        }}
                      >
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Notes</label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Interview tips, contact names, follow-up reminders..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 resize-none"
                />
              </div>

              <button
                onClick={submit}
                disabled={!form.job_title || !form.company}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 transition-opacity"
                style={{ background: '#0A1628' }}
              >
                {editing ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
