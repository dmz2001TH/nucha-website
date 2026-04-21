'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import IconSelector from '@/components/IconSelector'
import ImageUpload from '@/components/ImageUpload'
import { useToast } from '@/components/Toast'

interface Service {
  id: string
  title: string
  titleEn: string | null
  description: string | null
  icon: string | null
  coverImage: string | null
  status: string
  sortOrder: number
  features: string | null
  whyChooseUs: string | null
  createdAt: string
}

const emptyForm = {
  title: '',
  titleEn: '',
  description: '',
  icon: '',
  coverImage: '',
  status: 'DRAFT',
  sortOrder: 0,
  features: '',
  whyChooseUs: ''
}

export default function AdminServicesPage() {
  const toast = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [editData, setEditData] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      setServices(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(Array.isArray(data.error) ? data.error.map((e: {message: string}) => e.message).join(', ') : (data.error || 'Failed to add service'))
      setServices([...services, data.data])
      setFormData(emptyForm)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding service:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    setSubmitting(true)
    try {
      const response = await fetch(`/api/services?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(Array.isArray(data.error) ? data.error.map((e: {message: string}) => e.message).join(', ') : (data.error || 'Failed to update service'))
      setServices(services.map(s => s.id === editingId ? data.data : s))
      setEditingId(null)
      setEditData(emptyForm)
    } catch (error) {
      console.error('Error updating service:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบบริการนี้?')) return
    try {
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
      setServices(services.filter(s => s.id !== id))
      toast.success('ลบบริการสำเร็จ')
    } catch {
      toast.error('ลบบริการไม่สำเร็จ')
    }
  }

  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setShowAddForm(false)
    setEditData({
      title: service.title,
      titleEn: service.titleEn || '',
      description: service.description || '',
      icon: service.icon || '',
      coverImage: service.coverImage || '',
      status: service.status,
      sortOrder: service.sortOrder,
      features: service.features || '',
      whyChooseUs: service.whyChooseUs || ''
    })
  }

  const filteredServices = services.filter(s => {
    const matchFilter = filter === 'all' || s.status === filter
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || (s.titleEn && s.titleEn.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const statusColors: Record<string, string> = {
    'DRAFT': 'bg-gray-100 text-gray-800',
    'PUBLISHED': 'bg-green-100 text-green-800',
    'ARCHIVED': 'bg-yellow-100 text-yellow-800'
  }

  const statusLabels: Record<string, string> = {
    'DRAFT': 'ร่าง',
    'PUBLISHED': 'เผยแพร่',
    'ARCHIVED': 'เก็บถาวร'
  }

  const renderForm = (
    onSubmit: (e: React.FormEvent) => void,
    data: typeof emptyForm,
    setData: React.Dispatch<React.SetStateAction<typeof emptyForm>>,
    onCancel: () => void,
    submitLabel: string
  ) => (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-lg font-headline font-bold text-gray-900 mb-6">
        {submitLabel === 'เพิ่ม' ? 'เพิ่มบริการใหม่' : 'แก้ไขบริการ'}
      </h2>

      <div className="mb-6">
        <ImageUpload
          value={data.coverImage}
          onChange={(url) => setData({ ...data, coverImage: url })}
          label="รูปปก"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">ชื่อบริการ *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="เช่น ออกแบบภายใน"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">ชื่อภาษาอังกฤษ</label>
          <input
            type="text"
            value={data.titleEn}
            onChange={(e) => setData({ ...data, titleEn: e.target.value })}
            placeholder="เช่น Interior Design"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">คำอธิบาย</label>
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          placeholder="อธิบายเกี่ยวกับบริการนี้..."
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        />
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">รายละเอียดบริการ (แต่ละบรรทัด = 1 ข้อ)</label>
        <textarea
          value={data.features}
          onChange={(e) => setData({ ...data, features: e.target.value })}
          rows={6}
          placeholder={"รับเหมาก่อสร้างบ้านเดี่ยว วิลล่า\nควบคุมคุณภาพตามมาตรฐาน\nบริหารงบประมาณและเวลา\nทีมงานมืออาชีพ"}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">ใส่ข้อความแต่ละบรรทัดเพื่อแสดงเป็นรายการ</p>
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">ทำไมต้องเลือกเรา (แต่ละบรรทัด = 1 ข้อ)</label>
        <textarea
          value={data.whyChooseUs}
          onChange={(e) => setData({ ...data, whyChooseUs: e.target.value })}
          rows={4}
          placeholder={"มาตรฐาน - การก่อสร้างตามมาตรฐานสากล\nตรงเวลา - ส่งมอบงานตรงกำหนด\nราคาชัดเจน - ไม่มีค่าใช้จ่ายซ่อนเร้น\nดูแลใส่ใจ - บริการหลังการขาย"}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">ใส่ข้อความแต่ละบรรทัดเพื่อแสดงเป็นรายการ</p>
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">ไอคอน</label>
        <IconSelector
          value={data.icon}
          onChange={(icon) => setData({ ...data, icon })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">สถานะ</label>
          <select
            value={data.status}
            onChange={(e) => setData({ ...data, status: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="DRAFT">ร่าง</option>
            <option value="PUBLISHED">เผยแพร่</option>
            <option value="ARCHIVED">เก็บถาวร</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-1">ลำดับการแสดง</label>
          <input
            type="number"
            value={data.sortOrder}
            onChange={(e) => setData({ ...data, sortOrder: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              กำลังบันทึก...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">save</span>
              {submitLabel}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 text-gray-700 px-8 py-3 font-headline font-bold text-sm rounded-lg hover:bg-gray-200 transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-headline font-black text-gray-900">บริการ</h1>
          <p className="text-gray-500 font-body mt-1">จัดการบริการทั้งหมด</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setEditingId(null)
            setFormData(emptyForm)
          }}
          className="bg-primary text-white px-6 py-3 font-headline font-bold text-sm tracking-wider rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">{showAddForm ? 'close' : 'add'}</span>
          {showAddForm ? 'ยกเลิก' : 'เพิ่มบริการ'}
        </button>
      </div>

      {showAddForm && renderForm(handleAdd, formData, setFormData, () => setShowAddForm(false), 'เพิ่ม')}

      {editingId && renderForm(handleEdit, editData, setEditData, () => setEditingId(null), 'บันทึก')}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาบริการ..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`font-headline text-xs tracking-wider font-bold px-4 py-2.5 rounded-lg transition-all ${
                filter === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'ทั้งหมด' : statusLabels[status] || status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
            {service.coverImage && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={service.coverImage}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                {service.icon && (
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl text-primary">{service.icon}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-gray-900">{service.title}</h3>
                  {service.titleEn && (
                    <p className="text-xs text-gray-500">{service.titleEn}</p>
                  )}
                </div>
              </div>
              {service.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-bold ${statusColors[service.status]}`}>
                  {statusLabels[service.status] || service.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(service)}
                    className="text-gray-400 hover:text-primary p-1"
                    title="แก้ไข"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="ลบ"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">design_services</span>
          <p className="text-gray-500 font-body">ยังไม่มีบริการ</p>
          <button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData(emptyForm)
            }}
            className="inline-block mt-4 text-primary font-headline font-bold hover:underline"
          >
            เพิ่มบริการแรก →
          </button>
        </div>
      )}
    </div>
  )
}
