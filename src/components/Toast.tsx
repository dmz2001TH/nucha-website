'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
}

interface ToastContextType {
  toast: (toast: Omit<Toast, 'id'>) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { ...t, id }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  const success = useCallback((message: string, title?: string) => {
    toast({ type: 'success', message, title: title || 'สำเร็จ' })
  }, [toast])

  const error = useCallback((message: string, title?: string) => {
    toast({ type: 'error', message, title: title || 'เกิดข้อผิดพลาด' })
  }, [toast])

  const warning = useCallback((message: string, title?: string) => {
    toast({ type: 'warning', message, title: title || 'แจ้งเตือน' })
  }, [toast])

  const info = useCallback((message: string, title?: string) => {
    toast({ type: 'info', message, title: title || 'ข้อมูล' })
  }, [toast])

  const icons: Record<string, string> = {
    success: 'check_circle',
    error: 'cancel',
    warning: 'warning',
    info: 'info'
  }

  const colors: Record<string, string> = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  const iconColors: Record<string, string> = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] space-y-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto border rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-in ${colors[t.type]}`}
          >
            <span className={`material-symbols-outlined text-[22px] mt-0.5 flex-shrink-0 ${iconColors[t.type]}`}>
              {icons[t.type]}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-headline font-bold text-sm">{t.title}</p>
              <p className="text-xs mt-0.5 opacity-80">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
