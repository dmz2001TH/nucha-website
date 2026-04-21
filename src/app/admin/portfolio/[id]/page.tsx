'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/components/Toast'

export default function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    titleEn: '',
    description: '',
    location: '',
    year: new Date().getFullYear(),
    category: 'RESIDENTIAL',
    coverImage: '',
    status: 'DRAFT',
    featured: false
  })

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`/api/portfolio/${id}`)
        const data = await response.json()
        setForm({
          title: data.title || '',
          titleEn: data.titleEn || '',
          description: data.description || '',
          location: data.location || '',
          year: data.year || new Date().getFullYear(),
          category: data.category || 'RESIDENTIAL',
          coverImage: data.coverImage || '',
          status: data.status || 'DRAFT',
          featured: data.featured || false
        })
      } catch {
        toast.error('ไม่พบผลงานนี้')
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: Number(form.year) })
      })
      if (response.ok) {
        toast.success('บันทึกผลงานสำเร็จ')
        router.push('/admin/portfolio')
      } else {
        toast.error('บันทึกไม่สำเร็จ')
      }
    } catch {
      toast.error('เกิดข้อผิดพลาด')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 max-w-3xl">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white rounded-xl p-6 space-y-6">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/portfolio" className="inline-flex items-center gap-1 text-gray-500 hover:text-primary font-body text-sm mb-4 transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          กลับไปผลงาน
        </Link>
        <h1 className="text-3xl font-headline font-black text-gray-900">แก้ไขผลงาน</h1>
        <p className="text-gray-500 font-body mt-1">แก้ไขข้อมูลผลงานการออกแบบ</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อผลงาน *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="ชื่อโครงการ" />
            </div>
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อภาษาอังกฤษ</label>
              <input type="text" name="titleEn" value={form.titleEn} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Project name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">คำอธิบาย *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" placeholder="รายละเอียดโครงการ" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานที่ *</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="เช่น พัทยา" />
            </div>
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ปี *</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">หมวดหมู่</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                <option value="RESIDENTIAL">บ้านพักอาศัย</option>
                <option value="COMMERCIAL">พาณิชย์</option>
                <option value="INTERIOR">ออกแบบภายใน</option>
                <option value="ARCHITECTURE">สถาปัตยกรรม</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานะ</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                <option value="DRAFT">ร่าง</option>
                <option value="PUBLISHED">เผยแพร่</option>
                <option value="ARCHIVED">เก็บถาวร</option>
              </select>
            </div>
          </div>

          <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} label="รูปปก *" />

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="featured" className="text-sm font-headline font-bold text-gray-700">แสดงเป็นผลงานแนะนำ</label>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="submit" disabled={submitting} className="bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50">
            <span className="material-symbols-outlined">save</span>
            {submitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <Link href="/admin/portfolio" className="text-gray-500 hover:text-gray-700 font-headline font-bold text-sm">ยกเลิก</Link>
        </div>
      </form>
    </div>
  )
}
