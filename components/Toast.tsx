'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export function Toast({ message, type = 'info', duration = 3500, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-[#0A1628]',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg animate-fade-in max-w-sm ${colors[type]}`}>
      <span className="text-base leading-none">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-xs">✕</button>
    </div>
  )
}

// Hook for easy use
import { useCallback, useRef } from 'react'

interface ToastState {
  message: string
  type: ToastType
  id: number
}

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null)
  const counter = useRef(0)

  const show = useCallback((message: string, type: ToastType = 'info') => {
    counter.current += 1
    setToast({ message, type, id: counter.current })
  }, [])

  const hide = useCallback(() => setToast(null), [])

  const toastEl = toast ? (
    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={hide} />
  ) : null

  return { show, toastEl }
}
