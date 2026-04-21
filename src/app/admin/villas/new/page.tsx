'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/components/Toast'

export default function NewVillaPage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    nameEn: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    landArea: '',
    coverImage: '',
    status: 'AVAILABLE',
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
    setLoading(true)

    try {
      const response = await fetch('/api/villas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          nameEn: form.nameEn || undefined,
          description: form.description,
          location: form.location,
          price: parseFloat(form.price),
          bedrooms: parseInt(form.bedrooms),
          bathrooms: parseInt(form.bathrooms),
          area: parseFloat(form.area),
          landArea: parseFloat(form.landArea),
          coverImage: form.coverImage,
          status: form.status,
          featured: form.featured
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create villa')
      }

      toast.success('เพิ่มวิลล่าสำเร็จ')
      router.push('/admin/villas')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/villas"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-headline text-sm font-bold"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          กลับไปรายการวิลล่า
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-gray-900">เพิ่มวิลล่าใหม่</h1>
        <p className="text-gray-500 font-body mt-1">กรอกข้อมูลวิลล่าใหม่</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อวิลล่า *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="เช่น Sunset Villa"
            />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อภาษาอังกฤษ</label>
            <input
              type="text"
              name="nameEn"
              value={form.nameEn}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="e.g. Sunset Villa"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-headline font-bold text-gray-700 mb-2">รายละเอียด *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm resize-none"
            placeholder="รายละเอียดของวิลล่า..."
          />
        </div>

        <div>
          <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานที่ *</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
            placeholder="เช่น ภูเก็ต, เชียงใหม่"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ราคา (บาท) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ห้องนอน *</label>
            <input
              type="number"
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ห้องน้ำ *</label>
            <input
              type="number"
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">พื้นที่ใช้สอย (ตร.ม.) *</label>
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">พื้นที่ดิน (ตร.ม.) *</label>
            <input
              type="number"
              name="landArea"
              value={form.landArea}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm"
              placeholder="0"
            />
          </div>
        </div>

        <ImageUpload
          value={form.coverImage}
          onChange={(url) => setForm({ ...form, coverImage: url })}
          label="รูปปก *"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานะ</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-body text-sm bg-white"
            >
              <option value="AVAILABLE">ว่าง</option>
              <option value="RESERVED">จองแล้ว</option>
              <option value="SOLD">ขายแล้ว</option>
              <option value="UNDER_CONSTRUCTION">กำลังก่อสร้าง</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-headline font-bold text-gray-700">แสดงเป็นวิลล่าแนะนำ</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Link href="/admin/villas" className="px-6 py-3 font-headline font-bold text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ยกเลิก
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                กำลังบันทึก...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                บันทึก
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
