'use client'

import { useState, useRef } from 'react'

interface MultiImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

export default function MultiImageUpload({ value = [], onChange, label }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'uploads')

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedUrls.push(data.data.url)
        }
      }

      onChange([...value, ...uploadedUrls])
    } catch (error) {
      console.error('Error uploading:', error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) handleUpload(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files) handleUpload(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      {label && (
        <label className="text-sm font-headline font-bold text-gray-700 mb-3 block">
          {label}
        </label>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={url} alt={`รูปที่ ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        className={`border-2 border-dashed rounded-xl cursor-pointer transition-all flex flex-col items-center justify-center py-4 ${
          dragOver
            ? 'border-primary bg-primary/5'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
            <p className="text-xs text-gray-500 font-body mt-1">กำลังอัปโหลด...</p>
          </>
        ) : (
          <div className="text-center">
            <span className="material-symbols-outlined text-3xl text-gray-400">add_photo_alternate</span>
            <p className="text-xs text-gray-600 font-body font-bold mt-1">คลิกเพื่อเลือกหลายรูป</p>
            <p className="text-xs text-gray-400 font-body mt-0.5">รองรับ JPG, PNG, WebP</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}