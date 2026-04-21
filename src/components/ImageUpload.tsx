'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'uploads')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.data.url)
      } else {
        alert('อัปโหลดไม่สำเร็จ กรุณาลองใหม่')
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  return (
    <div>
      {label && (
        <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-2">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group">
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 relative">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              เปลี่ยนรูป
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              ลบ
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`aspect-video border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            dragOver
              ? 'border-primary bg-primary/5'
              : uploading
              ? 'border-gray-300 bg-gray-50'
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
        >
          {uploading ? (
            <>
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
              <p className="text-sm text-gray-500 font-body">กำลังอัปโหลด...</p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-gray-400">cloud_upload</span>
              <div className="text-center">
                <p className="text-sm text-gray-600 font-body font-bold">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                <p className="text-xs text-gray-400 font-body mt-1">รองรับ JPG, PNG, WebP (สูงสุด 10MB)</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL Input as alternative */}
      <div className="mt-3">
        <details className="text-xs">
          <summary className="text-gray-500 cursor-pointer hover:text-primary font-headline">
            หรือใส่ URL รูปภาพ
          </summary>
          <div className="mt-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </details>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
