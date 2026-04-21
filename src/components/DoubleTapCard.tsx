'use client'

import { useState, useRef, useCallback } from 'react'

interface DoubleTapCardProps {
  href: string
  children: (isActive: boolean) => React.ReactNode
  className?: string
}

export default function DoubleTapCard({ href, children, className = '' }: DoubleTapCardProps) {
  const [isActive, setIsActive] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number>(0)

  const handleTap = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    // Desktop: ใช้ hover ปกติ ไม่ต้องจัดการ
    if (window.matchMedia('(hover: hover)').matches) {
      return
    }

    // Mobile: จัดการ double tap
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap: ไปหน้านั้น
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsActive(false)
      window.location.href = href
    } else {
      // Single tap: แสดง effect
      e.preventDefault()
      setIsActive(true)

      // ซ่อน effect หลังจาก 3 วินาทีถ้าไม่มี tap ต่อ
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsActive(false)
      }, 3000)
    }

    lastTapRef.current = now
  }, [href])

  // Desktop: ใช้ <a> ปกติ
  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
    return (
      <a href={href} className={className}>
        {children(false)}
      </a>
    )
  }

  // Mobile: ใช้ double tap
  return (
    <div
      onClick={handleTap}
      onTouchEnd={handleTap}
      className={`${className} ${isActive ? 'active' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      {children(isActive)}
    </div>
  )
}
