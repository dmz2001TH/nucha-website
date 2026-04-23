'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Page {
  id: string
  title: string
  titleEn: string | null
  slug: string
  content: string | null
  contentEn: string | null
  coverImage: string | null
  status: string
  updatedAt: string
  createdAt: string
}

const emptyForm = {
  title: '',
  titleEn: '',
  slug: '',
  content: '',
  contentEn: '',
  coverImage: '',
  status: 'DRAFT'
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [editData, setEditData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [previewPage, setPreviewPage] = useState<Page | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      setPages(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to add page')
      setPages([...pages, data.data])
      setFormData(emptyForm)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding page:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setSubmitting(true)
    try {
      const response = await fetch(`/api/pages/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to update page')
      setPages(pages.map(p => p.id === editingId ? data.data : p))
      setEditingId(null)
      setEditData(emptyForm)
    } catch (error) {
      console.error('Error updating page:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบ Page นี้?')) return
    try {
      await fetch(`/api/pages/${id}`, { method: 'DELETE' })
      setPages(pages.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const startEdit = (page: Page) => {
    setEditingId(page.id)
    setShowAddForm(false)
    setEditData({
      title: page.title,
      titleEn: page.titleEn || '',
      slug: page.slug,
      content: page.content || '',
      contentEn: page.contentEn || '',
      coverImage: page.coverImage || '',
      status: page.status
    })
  }

  const filteredPages = filter === 'all'
    ? pages
    : pages.filter(p => p.status === filter)

  const statusColors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PUBLISHED': 'bg-green-100 text-green-800',
    'ARCHIVED': 'bg-yellow-100 text-yellow-800'
  }

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    data: typeof emptyForm,
    setData: React.Dispatch<React.SetStateAction<typeof emptyForm>>,
    onCancel: () => void,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-headline font-bold text-gray-900 mb-4">
        {submitLabel === 'เพิ่ม' ? 'เพิ่ม Page ใหม่' : 'แก้ไข Page'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Title EN</label>
          <input
            type="text"
            value={data.titleEn}
            onChange={(e) => setData({ ...data, titleEn: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Slug</label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Cover Image URL</label>
          <input
            type="text"
            value={data.coverImage}
            onChange={(e) => setData({ ...data, coverImage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Content</label>
          <textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Content EN</label>
          <textarea
            value={data.contentEn}
            onChange={(e) => setData({ ...data, contentEn: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">Status</label>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white px-6 py-2 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
        >
          {submitting ? 'กำลังบันทึก...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-6 py-2 font-headline font-bold text-sm rounded-lg hover:bg-gray-200 transition-all"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  )

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 m-4 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">Pages</h1>
          <p className="text-gray-500 font-body mt-1">จัดการเนื้อหาหน้าเพจ</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setEditingId(null)
            setFormData(emptyForm)
          }}
          className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-wider uppercase rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
          {showAddForm ? 'ยกเลิก' : 'เพิ่ม Page'}
        </button>
      </div>

      {showAddForm && renderForm(handleAdd, formData, setFormData, () => setShowAddForm(false), 'เพิ่ม')}

      {editingId && renderForm(handleEdit, editData, setEditData, () => setEditingId(null), 'บันทึก')}

      <div className="flex flex-wrap gap-3 mb-6">
        {['all', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`font-headline text-xs tracking-wider uppercase font-bold px-4 py-2 rounded-lg transition-all ${
              filter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'ทั้งหมด' : status}
          </button>
        ))}
      </div>

      {/* Card Grid with Image Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            {/* Cover Image Preview */}
            <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              {page.coverImage ? (
                <Image
                  src={page.coverImage}
                  alt={page.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px)100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-gray-300">description</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[page.status]}`}>
                  {page.status}
                </span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => setPreviewPage(page)}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-white transition-all flex items-center gap-2 shadow-lg"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  ดูตัวอย่าง
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-headline font-bold text-gray-900 mb-1 line-clamp-1">{page.title}</h3>
              {page.titleEn && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{page.titleEn}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">/{page.slug}</span>
                <span className="text-xs text-gray-400">
                  {new Date(page.updatedAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setPreviewPage(page)}
                  className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-all"
                  title="ดูตัวอย่าง"
                >
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
                <button
                  onClick={() => startEdit(page)}
                  className="text-gray-400 hover:text-primary p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  title="แก้ไข"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                  title="ลบ"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">description</span>
          <p className="text-gray-500 font-body">ยังไม่มี Page</p>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData(emptyForm)
            }}
            className="inline-block mt-4 text-primary font-headline font-bold hover:underline"
          >
            เพิ่ม Page แรก →
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setPreviewPage(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-headline font-bold text-gray-900 text-lg">{previewPage.title}</h2>
                {previewPage.titleEn && <p className="text-sm text-gray-500">{previewPage.titleEn}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[previewPage.status]}`}>
                  {previewPage.status}
                </span>
                <button
                  onClick={() => { startEdit(previewPage); setPreviewPage(null); }}
                  className="text-gray-500 hover:text-primary flex items-center gap-1 text-sm font-headline font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  แก้ไข
                </button>
                <button
                  onClick={() => setPreviewPage(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {previewPage.coverImage && (
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={previewPage.coverImage}
                    alt={previewPage.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">link</span>
                    /{previewPage.slug}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    {new Date(previewPage.updatedAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {previewPage.content ? (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {previewPage.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-3">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">ไม่มีเนื้อหา</p>
                )}

                {previewPage.contentEn && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-headline font-bold text-gray-500 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">translate</span>
                      English Content
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      {previewPage.contentEn.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-3">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
