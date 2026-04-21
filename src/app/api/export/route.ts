import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'bookings'
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let data: Record<string, unknown>[] = []
    let filename = ''

    if (type === 'bookings') {
      const where: Record<string, unknown> = {}
      if (status) where.status = status
      if (startDate || endDate) {
        where.date = {}
        if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate)
        if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate)
      }

      const bookings = await prisma.booking.findMany({
        where,
        orderBy: { date: 'desc' }
      })

      const statusLabels: Record<string, string> = {
        'PENDING': 'รอยืนยัน',
        'CONFIRMED': 'ยืนยันแล้ว',
        'CANCELLED': 'ยกเลิก',
        'COMPLETED': 'เสร็จสิ้น'
      }

      data = bookings.map(b => ({
        'ชื่อ': b.name,
        'อีเมล': b.email,
        'โทรศัพท์': b.phone,
        'วันที่จอง': new Date(b.date).toLocaleDateString('th-TH'),
        'เวลา': b.timeSlot,
        'หัวข้อ': b.topic || '-',
        'ข้อความ': b.message || '-',
        'สถานะ': statusLabels[b.status] || b.status,
        'วันที่ส่ง': new Date(b.createdAt).toLocaleDateString('th-TH')
      }))

      filename = `bookings_${new Date().toISOString().split('T')[0]}.xlsx`
    } else if (type === 'inquiries') {
      const where: Record<string, unknown> = {}
      if (status) where.status = status
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) (where.createdAt as Record<string, unknown>).gte = new Date(startDate)
        if (endDate) (where.createdAt as Record<string, unknown>).lte = new Date(endDate)
      }

      const inquiries = await prisma.inquiry.findMany({
        where,
        include: {
          villa: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      const interestLabels: Record<string, string> = {
        'RESIDENTIAL_DESIGN': 'ออกแบบบ้านพักอาศัย',
        'COMMERCIAL_PROJECT': 'โครงการพาณิชย์',
        'INTERIOR_CONSULTATION': 'ปรึกษาออกแบบภายใน',
        'VILLA_PURCHASE': 'ซื้อวิลล่า',
        'GENERAL_INQUIRY': 'สอบถามทั่วไป'
      }

      const statusLabels: Record<string, string> = {
        'NEW': 'ใหม่',
        'CONTACTED': 'ติดต่อแล้ว',
        'IN_PROGRESS': 'กำลังดำเนินการ',
        'QUALIFIED': 'มีศักยภาพ',
        'CONVERTED': 'ปิดการขาย',
        'CLOSED': 'ปิด'
      }

      data = inquiries.map(i => ({
        'ชื่อ': i.name,
        'อีเมล': i.email,
        'โทรศัพท์': i.phone || '-',
        'ความสนใจ': interestLabels[i.interest] || i.interest,
        'ข้อความ': i.message || '-',
        'วิลล่า': i.villa?.name || '-',
        'สถานะ': statusLabels[i.status] || i.status,
        'วันที่ส่ง': new Date(i.createdAt).toLocaleDateString('th-TH')
      }))

      filename = `inquiries_${new Date().toISOString().split('T')[0]}.xlsx`
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    // Create Excel file
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, type === 'bookings' ? 'การจองคิว' : 'คำถาม')

    // Set column widths
    const columnWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }))
    worksheet['!cols'] = columnWidths

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 })
  }
}
