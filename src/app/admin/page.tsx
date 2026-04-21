'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DashboardStats {
  totals: {
    portfolios: number
    villas: number
    inquiries: number
    bookings: number
    media: number
    services: number
  }
  inquiries: {
    newThisMonth: number
    byStatus: Record<string, number>
    recent: Array<{
      id: string
      name: string
      email: string
      interest: string
      status: string
      createdAt: string
    }>
  }
  bookings: {
    newThisMonth: number
    newThisWeek: number
    byStatus: Record<string, number>
    recent: Array<{
      id: string
      name: string
      phone: string
      date: string
      timeSlot: string
      status: string
      createdAt: string
    }>
    upcoming: Array<{
      id: string
      name: string
      date: string
      timeSlot: string
      status: string
    }>
  }
  villas: {
    byStatus: Record<string, number>
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      setStats(data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    'NEW': 'bg-blue-100 text-blue-800',
    'CONTACTED': 'bg-yellow-100 text-yellow-800',
    'IN_PROGRESS': 'bg-purple-100 text-purple-800',
    'QUALIFIED': 'bg-green-100 text-green-800',
    'CONVERTED': 'bg-emerald-100 text-emerald-800',
    'CLOSED': 'bg-gray-100 text-gray-800',
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'CONFIRMED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    'COMPLETED': 'bg-blue-100 text-blue-800'
  }

  const statusLabels: Record<string, string> = {
    'NEW': 'ใหม่',
    'CONTACTED': 'ติดต่อแล้ว',
    'IN_PROGRESS': 'กำลังดำเนินการ',
    'QUALIFIED': 'ผ่านเกณฑ์',
    'CONVERTED': 'สำเร็จ',
    'CLOSED': 'ปิด',
    'PENDING': 'รอยืนยัน',
    'CONFIRMED': 'ยืนยันแล้ว',
    'CANCELLED': 'ยกเลิก',
    'COMPLETED': 'เสร็จสิ้น'
  }

  const interestLabels: Record<string, string> = {
    'RESIDENTIAL_DESIGN': 'ออกแบบบ้านพักอาศัย',
    'COMMERCIAL_PROJECT': 'โครงการพาณิชย์',
    'INTERIOR_CONSULTATION': 'ปรึกษาออกแบบภายใน',
    'VILLA_PURCHASE': 'ซื้อวิลล่า',
    'GENERAL_INQUIRY': 'สอบถามทั่วไป'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-500 font-body mt-1">ภาพรวมระบบจัดการเว็บไซต์</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">ผลงาน</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.portfolios || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">photo_library</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">วิลล่า</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.villas || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">home</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">บริการ</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.services || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">design_services</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">จองคิว</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.bookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">event</span>
            </div>
          </div>
          <p className="text-xs text-green-600 font-bold mt-4">
            +{stats?.bookings.newThisWeek || 0} สัปดาห์นี้
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">คำถาม</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.inquiries || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">mail</span>
            </div>
          </div>
          <p className="text-xs text-green-600 font-bold mt-4">
            +{stats?.inquiries.newThisMonth || 0} เดือนนี้
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-body">มีเดีย</p>
              <p className="text-3xl font-headline font-black text-gray-900">{stats?.totals.media || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">perm_media</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-headline font-bold text-gray-900">นัดหมายที่กำลังมาถึง</h2>
              <Link href="/admin/bookings" className="text-xs text-primary font-headline font-bold hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.bookings.upcoming.map((booking) => (
              <div key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{booking.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} • {booking.timeSlot}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[booking.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[booking.status] || booking.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.bookings.upcoming || stats.bookings.upcoming.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">event_busy</span>
                <p className="font-body">ไม่มีนัดหมายที่กำลังมาถึง</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-headline font-bold text-gray-900">คำถามล่าสุด</h2>
              <Link href="/admin/inquiries" className="text-xs text-primary font-headline font-bold hover:underline">
                ดูทั้งหมด →
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {stats?.inquiries.recent.map((inquiry) => (
              <div key={inquiry.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{inquiry.name}</p>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[inquiry.status] || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[inquiry.status] || inquiry.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>{interestLabels[inquiry.interest] || inquiry.interest}</span>
                  <span>{new Date(inquiry.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            ))}
            {(!stats?.inquiries.recent || stats.inquiries.recent.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                <p className="font-body">ยังไม่มีคำถาม</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-headline font-bold text-gray-900 mb-4">ส่งออกข้อมูล</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/api/export?type=bookings"
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary group-hover:text-white">event</span>
            </div>
            <div>
              <p className="font-headline font-bold">ส่งออกการจองคิว</p>
              <p className="text-sm text-gray-500 group-hover:text-white/80">ดาวน์โหลดเป็น Excel</p>
            </div>
            <span className="material-symbols-outlined ml-auto">download</span>
          </Link>
          <Link href="/api/export?type=inquiries"
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group"
          >
            <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary group-hover:text-white">mail</span>
            </div>
            <div>
              <p className="font-headline font-bold">ส่งออกคำถาม</p>
              <p className="text-sm text-gray-500 group-hover:text-white/80">ดาวน์โหลดเป็น Excel</p>
            </div>
            <span className="material-symbols-outlined ml-auto">download</span>
          </Link>
        </div>
      </div>

      {/* Quick Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-headline font-bold text-gray-900 mb-4">เมนูด่วน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link href="/admin/portfolio/new" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">add_photo_alternate</span>
            <span className="text-sm font-headline font-bold">เพิ่มผลงาน</span>
          </Link>
          <Link href="/admin/villas/new" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">add_home</span>
            <span className="text-sm font-headline font-bold">เพิ่มวิลล่า</span>
          </Link>
          <Link href="/admin/services" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">design_services</span>
            <span className="text-sm font-headline font-bold">จัดการบริการ</span>
          </Link>
          <Link href="/admin/bookings" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">event</span>
            <span className="text-sm font-headline font-bold">จัดการจองคิว</span>
          </Link>
          <Link href="/admin/media" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
            <span className="text-sm font-headline font-bold">อัปโหลดรูป</span>
          </Link>
          <Link href="/admin/settings" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition-all group">
            <span className="material-symbols-outlined text-2xl mb-2 group-hover:scale-110 transition-transform">settings</span>
            <span className="text-sm font-headline font-bold">ตั้งค่า</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
