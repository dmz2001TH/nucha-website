'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/components/Toast'

interface VillaImage {
  id: string
  url: string
  alt: string | null
  altEn: string | null
  sortOrder: number
}

export default function EditVillaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const toast = useToast()
  const [villaId, setVillaId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [images, setImages] = useState<VillaImage[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
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

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setVillaId(resolved.id)
      fetchVilla(resolved.id)
    }
    resolveParams()
  }, [params])

  const fetchVilla = async (id: string) => {
    try {
      const response = await fetch(`/api/villas/${id}`)
      if (!response.ok) throw new Error('ไม่พบวิลล่านี้')
      const data = await response.json()
      const villa = data.data
      setForm({
        name: villa.name,
        nameEn: villa.nameEn || '',
        description: villa.description,
        location: villa.location,
        price: villa.price.toString(),
        bedrooms: villa.bedrooms.toString(),
        bathrooms: villa.bathrooms.toString(),
        area: villa.area.toString(),
        landArea: villa.landArea.toString(),
        coverImage: villa.coverImage,
        status: villa.status,
        featured: villa.featured
      })
      setImages(villa.images || [])
    } catch {
      toast.error('ไม่พบวิลล่านี้')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleAddImage = async (url: string) => {
    if (!url || uploadingImage) return
    setUploadingImage(true)
    try {
      const response = await fetch(`/api/villas/${villaId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, alt: '', altEn: '', sortOrder: images.length })
      })
      if (response.ok) {
        const data = await response.json()
        setImages([...images, data.data])
        toast.success('เพิ่มรูปภาพสำเร็จ')
      }
    } catch {
      toast.error('เพิ่มรูปไม่สำเร็จ')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/villas/${villaId}/images/${imageId}`, { method: 'DELETE' })
      if (response.ok) {
        setImages(images.filter(img => img.id !== imageId))
        toast.success('ลบรูปภาพสำเร็จ')
      }
    } catch {
      toast.error('ลบรูปไม่สำเร็จ')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/villas/${villaId}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'บันทึกไม่สำเร็จ')
      }

      toast.success('บันทึกวิลล่าสำเร็จ')
      router.push('/admin/villas')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="bg-white rounded-xl p-6 space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/villas" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-headline text-sm font-bold">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          กลับไปรายการวิลล่า
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-gray-900">แก้ไขวิลล่า</h1>
        <p className="text-gray-500 font-body mt-1">แก้ไขข้อมูลวิลล่า</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อวิลล่า *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="เช่น Sunset Villa" />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ชื่อภาษาอังกฤษ</label>
            <input type="text" name="nameEn" value={form.nameEn} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. Sunset Villa" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-headline font-bold text-gray-700 mb-2">รายละเอียด *</label>
          <textarea name="description" value={form.description} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" placeholder="รายละเอียดของวิลล่า..." />
        </div>

        <div>
          <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานที่ *</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="เช่น ภูเก็ต, เชียงใหม่" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ราคา (บาท) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ห้องนอน *</label>
            <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} required min="1" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">ห้องน้ำ *</label>
            <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} required min="1" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">พื้นที่ใช้สอย (ตร.ม.) *</label>
            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
          </div>
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">พื้นที่ดิน (ตร.ม.) *</label>
            <input type="number" name="landArea" value={form.landArea} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="0" />
          </div>
        </div>

        <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} label="รูปปก *" />

        <div>
          <label className="block text-sm font-headline font-bold text-gray-700 mb-3">อัลบั้มรูปภาพ</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <img src={image.url} alt={image.alt || ''} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            ))}
            <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => handleAddImage(reader.result as string)
                    reader.readAsDataURL(file)
                  }
                }}
              />
              <div className="text-center text-gray-400">
                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                <p className="text-xs mt-1">เพิ่มรูป</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-headline font-bold text-gray-700 mb-2">สถานะ</label>
            <select name="status" value={form.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white">
              <option value="AVAILABLE">ว่าง</option>
              <option value="RESERVED">จองแล้ว</option>
              <option value="SOLD">ขายแล้ว</option>
              <option value="UNDER_CONSTRUCTION">กำลังก่อสร้าง</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20" />
              <span className="text-sm font-headline font-bold text-gray-700">แสดงเป็นวิลล่าแนะนำ</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <Link href="/admin/villas" className="px-6 py-3 font-headline font-bold text-sm text-gray-600 hover:text-gray-900 transition-colors">ยกเลิก</Link>
          <button type="submit" disabled={saving} className="bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50">
            {saving ? (<><span className="material-symbols-outlined animate-spin">progress_activity</span>กำลังบันทึก...</>) : (<><span className="material-symbols-outlined">save</span>บันทึก</>)}
          </button>
        </div>
      </form>
    </div>
  )
}
