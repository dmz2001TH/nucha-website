'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Media {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  folder: string
  createdAt: string
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media')
      const data = await response.json()
      setMedia(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    for (const file of Array.from(files)) {
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
          setMedia(prev => [data.data, ...prev])
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบไฟล์นี้?')) return
    
    try {
      await fetch(`/api/media/${id}`, { method: 'DELETE' })
      setMedia(media.filter(m => m.id !== id))
      if (selectedMedia?.id === id) {
        setSelectedMedia(null)
      }
    } catch (error) {
      console.error('Error deleting media:', error)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('คัดลอก URL แล้ว!')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredMedia = media.filter(m => {
    const matchFilter = filter === 'all' || m.mimeType.startsWith(filter)
    const matchSearch = !search || m.originalName.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">Media Library</h1>
          <p className="text-gray-500 font-body mt-1">จัดการรูปภาพและไฟล์</p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">{uploading ? 'progress_activity' : 'cloud_upload'}</span>
            {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาไฟล์..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'image/', label: 'รูปภาพ' },
            { value: 'application/', label: 'เอกสาร' }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-headline text-xs tracking-wider font-bold px-4 py-2.5 rounded-lg transition-all ${
                filter === f.value ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Media Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedMedia?.id === item.id ? 'border-primary' : 'border-transparent'
                }`}
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {item.mimeType.startsWith('image/') ? (
                    <Image
                      src={item.url}
                      alt={item.originalName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-gray-400">description</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.originalName}</p>
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">perm_media</span>
              <p className="text-gray-500 font-body">ยังไม่มีไฟล์</p>
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 text-primary font-headline font-bold hover:underline cursor-pointer"
              >
                อัปโหลดไฟล์แรก →
              </label>
            </div>
          )}
        </div>

        {/* Media Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {selectedMedia ? (
            <div className="p-6">
              <h2 className="text-lg font-headline font-bold text-gray-900 mb-4">รายละเอียด</h2>
              
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {selectedMedia.mimeType.startsWith('image/') ? (
                  <Image
                    src={selectedMedia.url}
                    alt={selectedMedia.originalName}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-8xl text-gray-400">description</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ชื่อไฟล์</label>
                  <p className="text-sm font-bold text-gray-900 truncate">{selectedMedia.originalName}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ขนาด</label>
                  <p className="text-sm text-gray-900">{formatFileSize(selectedMedia.size)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ประเภท</label>
                  <p className="text-sm text-gray-900">{selectedMedia.mimeType}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedMedia.url}
                      readOnly
                      className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => copyToClipboard(selectedMedia.url)}
                      className="text-primary hover:bg-primary hover:text-white p-1 rounded transition-colors"
                    >
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedMedia.id)}
                className="mt-6 w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">delete</span>
                ลบไฟล์
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">touch_app</span>
              <p className="font-body">เลือกไฟล์เพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
