'use client'

import { useState, useEffect } from 'react'

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  interest: string
  message: string | null
  status: string
  notes: string | null
  createdAt: string
  assignedTo: { id: string; name: string } | null
  villa: { id: string; name: string } | null
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries')
      const data = await response.json()
      setInquiries(Array.isArray(data.data) ? data.data : [])
    } catch (error) {
      console.error('Error fetching inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i))
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status })
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
    }
  }

  const filteredInquiries = inquiries.filter(i => {
    const matchFilter = filter === 'all' || i.status === filter
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const statusColors: Record<string, string> = {
    'NEW': 'bg-blue-100 text-blue-800',
    'CONTACTED': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800',
    'QUALIFIED': 'bg-green-100 text-green-800',
    'CONVERTED': 'bg-emerald-100 text-emerald-800',
    'CLOSED': 'bg-gray-100 text-gray-800'
  }

  const statusLabels: Record<string, string> = {
    'NEW': 'ใหม่',
    'CONTACTED': 'ติดต่อแล้ว',
    'IN_PROGRESS': 'กำลังดำเนินการ',
    'QUALIFIED': 'ผ่านเกณฑ์',
    'CONVERTED': 'สำเร็จ',
    'CLOSED': 'ปิด'
  }

  const interestLabels: Record<string, string> = {
    'RESIDENTIAL_DESIGN': 'ออกแบบบ้านพักอาศัย',
    'COMMERCIAL_PROJECT': 'โครงการพาณิชย์',
    'INTERIOR_CONSULTATION': 'ปรึกษาออกแบบภายใน',
    'VILLA_PURCHASE': 'ซื้อวิลล่า',
    'GENERAL_INQUIRY': 'สอบถามทั่วไป'
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-gray-900">คำถาม</h1>
        <p className="text-gray-500 font-body mt-1">จัดการคำขอปรึกษาจากลูกค้า</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ หรืออีเมล..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'QUALIFIED', 'CONVERTED', 'CLOSED'].map((status) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredInquiries.map((inquiry) => (
              <div 
                key={inquiry.id} 
                onClick={() => setSelectedInquiry(inquiry)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedInquiry?.id === inquiry.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{inquiry.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColors[inquiry.status]}`}>
                        {statusLabels[inquiry.status] || inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{inquiry.email}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{inquiry.message || 'ไม่มีข้อความ'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleDateString('th-TH')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(inquiry.createdAt).toLocaleTimeString('th-TH')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredInquiries.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">inbox</span>
                <p className="text-gray-500 font-body">ยังไม่มีคำถาม</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {selectedInquiry ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-headline font-bold text-gray-900">รายละเอียด</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[selectedInquiry.status]}`}>
                  {statusLabels[selectedInquiry.status] || selectedInquiry.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ชื่อ</label>
                  <p className="font-bold text-gray-900">{selectedInquiry.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">อีเมล</label>
                  <p className="text-gray-900">{selectedInquiry.email}</p>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">โทรศัพท์</label>
                    <p className="text-gray-900">{selectedInquiry.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ความสนใจ</label>
                  <p className="text-gray-900">{interestLabels[selectedInquiry.interest] || selectedInquiry.interest}</p>
                </div>
                {selectedInquiry.message && (
                  <div>
                    <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ข้อความ</label>
                    <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{selectedInquiry.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">วันที่ส่ง</label>
                  <p className="text-gray-900">
                    {new Date(selectedInquiry.createdAt).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-2">
                  อัปเดตสถานะ
                </label>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="NEW">ใหม่</option>
                  <option value="CONTACTED">ติดต่อแล้ว</option>
                  <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                  <option value="QUALIFIED">ผ่านเกณฑ์</option>
                  <option value="CONVERTED">สำเร็จ</option>
                  <option value="CLOSED">ปิด</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-500 font-headline uppercase tracking-wider block mb-2">
                  บันทึก
                </label>
                <textarea
                  placeholder="เพิ่มบันทึก..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
                <button className="mt-2 w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-gray-200 transition-colors">
                  บันทึก
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">touch_app</span>
              <p className="font-body">เลือกคำถามเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
