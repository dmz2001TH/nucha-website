'use client'

import { useState, useRef, useEffect } from 'react'

interface BeforeAfterItem {
  id: string
  title: string
  titleEn?: string
  description?: string
  beforeImage: string
  afterImage: string
}

interface BeforeAfterSliderProps {
  items: BeforeAfterItem[]
  className?: string
}

export default function BeforeAfterSlider({ items, className = '' }: BeforeAfterSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentItem = items[currentIndex]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return
      updateSliderPosition(e.clientX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return
      updateSliderPosition(e.touches[0].clientX)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging])

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    if ('touches' in e) {
      updateSliderPosition(e.touches[0].clientX)
    } else {
      updateSliderPosition(e.clientX)
    }
  }

  if (items.length === 0) {
    return (
      <div className={`text-center py-12 text-gray-500 ${className}`}>
        <span className="material-symbols-outlined text-6xl mb-4 block">compare</span>
        <p>ยังไม่มีผลงานเปรียบเทียบ</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Slider */}
      <div
        ref={containerRef}
        className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none"
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        {/* After Image (Background) */}
        <img
          src={currentItem.afterImage}
          alt={`${currentItem.title} - After`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={currentItem.beforeImage}
            alt={`${currentItem.title} - Before`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-lg">chevron_left</span>
              <span className="material-symbols-outlined text-primary text-lg">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-headline font-bold">
          ก่อน
        </div>
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-headline font-bold">
          หลัง
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-headline font-bold text-gray-900">{currentItem.title}</h3>
        {currentItem.description && (
          <p className="text-sm text-gray-600 font-body mt-1">{currentItem.description}</p>
        )}
      </div>

      {/* Thumbnails */}
      {items.length > 1 && (
        <div className="flex gap-3 mt-4 justify-center overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentIndex(index)
                setSliderPosition(50)
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={item.afterImage} alt={item.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="text-center mt-2 text-xs text-gray-500 font-headline">
        {currentIndex + 1} / {items.length}
      </div>
    </div>
  )
}
