'use client'

import { useState } from 'react'
import Image from 'next/image'

interface VirtualTourProps {
  tourUrl?: string
  images?: string[]
  title?: string
  className?: string
}

export default function VirtualTour({ tourUrl, images, title, className = '' }: VirtualTourProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // ถ้ามี tourUrl (เช่น Matterport, Kuula) ใช้ iframe
  if (tourUrl) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all"
        >
          <span className="material-symbols-outlined">360</span>
          ดูทัวร์เสมือนจริง
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl h-[80vh]">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>
              <iframe
                src={tourUrl}
                className="w-full h-full rounded-xl"
                allowFullScreen
                title={title || 'Virtual Tour'}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  // ถ้ามี images array แสดง 360° gallery
  if (images && images.length > 0) {
    return (
      <div className={className}>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-widest rounded-lg hover:bg-primary-dark transition-all"
        >
          <span className="material-symbols-outlined">360</span>
          ดูทัวร์เสมือนจริง ({images.length} รูป)
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full max-w-6xl">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
              </button>

              <div className="relative">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${title || 'Virtual Tour'} - ${currentImageIndex + 1}`}
                  fill
                  className="object-cover rounded-xl"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />

                {/* Navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>

                {/* Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-headline">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ถ้าไม่มีข้อมูล แสดงปุ่ม disabled
  return (
    <button
      disabled
      className={`inline-flex items-center gap-2 bg-gray-300 text-gray-500 px-6 py-3 font-headline font-bold text-sm tracking-widest rounded-lg cursor-not-allowed ${className}`}
    >
      <span className="material-symbols-outlined">360</span>
      ทัวร์เสมือนจริง (เร็วๆ นี้)
    </button>
  )
}
