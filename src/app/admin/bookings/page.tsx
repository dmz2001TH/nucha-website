'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  date: string
  timeSlot: string
  topic: string | null
  message: string | null
  status: string
  notes: string | null
  createdAt: string
}

export default function AdminBookingsPage() {
  const toast = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      setBookings(data.data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status })
      }
      toast.success('อัปเดตสถานะสำเร็จ')
    } catch {
      toast.error('อัปเดตสถานะไม่สำเร็จ')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจที่จะลบการจองนี้?')) return
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      setBookings(bookings.filter(b => b.id !== id))
      if (selectedBooking?.id === id) {
        setSelectedBooking(null)
      }
      toast.success('ลบการจองสำเร็จ')
    } catch {
      toast.error('ลบการจองไม่สำเร็จ')
    }
  }

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'COMPLETED': 'bg-blue-100 text-blue-800'
  }

  const statusLabels: Record<string, string> = {
    'PENDING': 'รอยืนยัน',
    'CONFIRMED': 'ยืนยันแล้ว',
    'CANCELLED': 'ยกเลิก',
    'COMPLETED': 'เสร็จสิ้น'
  }

  const filteredBookings = bookings.filter(b => {
    return filter === 'all' || b.status === filter
  })

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
        <h1 className="text-3xl font-headline font-black text-gray-900">จองคิว</h1>
        <p className="text-gray-500 font-body mt-1">จัดการการจองคิวปรึกษาจากลูกค้า</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((status) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedBooking?.id === booking.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{booking.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${statusColors[booking.status]}`}>
                        {statusLabels[booking.status] || booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{booking.phone}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        {new Date(booking.date).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {booking.timeSlot}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredBookings.length === 0 && (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">event_busy</span>
                <p className="text-gray-500 font-body">ยังไม่มีการจองคิว</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Detail */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {selectedBooking ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-headline font-bold text-gray-900">รายละเอียด</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[selectedBooking.status]}`}>
                  {statusLabels[selectedBooking.status] || selectedBooking.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ชื่อ</label>
                  <p className="font-bold text-gray-900">{selectedBooking.name}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">อีเมล</label>
                  <p className="text-gray-900">{selectedBooking.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">โทรศัพท์</label>
                  <p className="text-gray-900">{selectedBooking.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">วันที่จอง</label>
                  <p className="text-gray-900 font-bold">
                    {new Date(selectedBooking.date).toLocaleDateString('th-TH', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">เวลา</label>
                  <p className="text-gray-900 font-bold">{selectedBooking.timeSlot}</p>
                </div>
                {selectedBooking.topic && (
                  <div>
                    <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">หัวข้อ</label>
                    <p className="text-gray-900">{selectedBooking.topic}</p>
                  </div>
                )}
                {selectedBooking.message && (
                  <div>
                    <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">ข้อความ</label>
                    <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded-lg">{selectedBooking.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500 font-headline uppercase tracking-wider">วันที่ส่ง</label>
                  <p className="text-gray-900">
                    {new Date(selectedBooking.createdAt).toLocaleDateString('th-TH', {
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
                  value={selectedBooking.status}
                  onChange={(e) => handleStatusChange(selectedBooking.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="PENDING">รอยืนยัน</option>
                  <option value="CONFIRMED">ยืนยันแล้ว</option>
                  <option value="COMPLETED">เสร็จสิ้น</option>
                  <option value="CANCELLED">ยกเลิก</option>
                </select>
              </div>

              <button
                onClick={() => handleDelete(selectedBooking.id)}
                className="mt-4 w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg font-headline font-bold text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">delete</span>
                ลบการจอง
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">touch_app</span>
              <p className="font-body">เลือกการจองเพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
