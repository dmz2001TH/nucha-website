'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

export default function NewPortfolioPage() {
  const router = useRouter()
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
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: Number(form.year) })
      })
      if (response.ok) {
        router.push('/admin/portfolio')
      }
    } catch (error) {
      console.error('Error creating portfolio:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-body focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
  const labelClass = "block text-sm font-headline font-bold text-gray-700 mb-2"

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-1 text-gray-500 hover:text-primary font-body text-sm mb-4 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          กลับไปผลงาน
        </Link>
        <h1 className="text-3xl font-headline font-black text-gray-900">เพิ่มผลงานใหม่</h1>
        <p className="text-gray-500 font-body mt-1">สร้างผลงานการออกแบบใหม่</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className={labelClass}>ชื่อผลงาน *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="ชื่อโครงการ"
              />
            </div>
            <div>
              <label htmlFor="titleEn" className={labelClass}>ชื่อภาษาอังกฤษ</label>
              <input
                type="text"
                id="titleEn"
                name="titleEn"
                value={form.titleEn}
                onChange={handleChange}
                className={inputClass}
                placeholder="Project name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>คำอธิบาย *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              className={inputClass}
              placeholder="รายละเอียดโครงการ"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className={labelClass}>สถานที่ *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="เช่น พัทยา"
              />
            </div>
            <div>
              <label htmlFor="year" className={labelClass}>ปี *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className={labelClass}>หมวดหมู่</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="RESIDENTIAL">บ้านพักอาศัย</option>
                <option value="COMMERCIAL">พาณิชย์</option>
                <option value="INTERIOR">ออกแบบภายใน</option>
                <option value="ARCHITECTURE">สถาปัตยกรรม</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>สถานะ</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="DRAFT">ร่าง</option>
                <option value="PUBLISHED">เผยแพร่</option>
                <option value="ARCHIVED">เก็บถาวร</option>
              </select>
            </div>
          </div>

          <ImageUpload
            value={form.coverImage}
            onChange={(url) => setForm({ ...form, coverImage: url })}
            label="รูปปก *"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="featured" className="text-sm font-headline font-bold text-gray-700">แสดงเป็นผลงานแนะนำ</label>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-8 py-3 font-headline font-bold text-sm tracking-wider rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined">save</span>
            {submitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
          <Link
            href="/admin/portfolio"
            className="text-gray-500 hover:text-gray-700 font-headline font-bold text-sm"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  )
}
