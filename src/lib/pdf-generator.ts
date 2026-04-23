import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BRAND_COLOR = '#C41E3A'
const BRAND_DARK = '#1a1a2e'
const GRAY = '#6b7280'
const LIGHT_GRAY = '#f3f4f6'
const WHITE = '#ffffff'

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Top accent bar
  doc.setFillColor(...hexToRgb(BRAND_COLOR))
  doc.rect(0, 0, pageWidth, 8, 'F')

  // Company name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...hexToRgb(GRAY))
  doc.text('NUCHA INNOVATION VILL PATTAYA', 20, 20)

  // Report title
  doc.setFontSize(22)
  doc.setTextColor(...hexToRgb(BRAND_DARK))
  doc.text(title, 20, 35)

  if (subtitle) {
    doc.setFontSize(11)
    doc.setTextColor(...hexToRgb(GRAY))
    doc.setFont('helvetica', 'normal')
    doc.text(subtitle, 20, 44)
  }

  // Divider line
  doc.setDrawColor(...hexToRgb(BRAND_COLOR))
  doc.setLineWidth(0.5)
  doc.line(20, 48, pageWidth - 20, 48)

  return 58
}

function addFooter(doc: jsPDF, pageNum: number) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(...hexToRgb(LIGHT_GRAY))
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')

  doc.setFontSize(8)
  doc.setTextColor(...hexToRgb(GRAY))
  doc.setFont('helvetica', 'normal')
  doc.text('NUCHA INNOVATION VILL PATTAYA | รายงานสร้างอัตโนมัติ', 20, pageHeight - 8)

  const dateStr = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(dateStr, pageWidth - 20, pageHeight - 8, { align: 'right' })

  doc.text(`หน้า ${pageNum}`, pageWidth / 2, pageHeight - 8, { align: 'center' })
}

function addSummaryCards(doc: jsPDF, startY: number, cards: { label: string; value: string; color?: string }[]) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const cardWidth = (pageWidth - 60) / cards.length
  const cardHeight = 28
  const gap = 10

  cards.forEach((card, i) => {
    const x = 20 + i * (cardWidth + gap)

    // Card background
    doc.setFillColor(...hexToRgb(WHITE))
    doc.setDrawColor(230, 230, 230)
    doc.roundedRect(x, startY, cardWidth, cardHeight, 3, 3, 'FD')

    // Value
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(card.color || BRAND_COLOR))
    doc.text(card.value, x + cardWidth / 2, startY + 13, { align: 'center' })

    // Label
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb(GRAY))
    doc.text(card.label, x + cardWidth / 2, startY + 22, { align: 'center' })
  })

  return startY + cardHeight + 15
}

// ========== BOOKINGS REPORT ==========
export async function generateBookingsPDF(bookings: {
  name: string
  email: string
  phone: string
  date: string
  timeSlot: string
  topic: string | null
  message: string | null
  status: string
  createdAt: string
}[]) {
  const doc = new jsPDF()
  let pageNum = 1

  const statusLabels: Record<string, string> = {
    'PENDING': 'รอยืนยัน',
    'CONFIRMED': 'ยืนยันแล้ว',
    'CANCELLED': 'ยกเลิก',
    'COMPLETED': 'เสร็จสิ้น'
  }

  // Summary stats
  const total = bookings.length
  const pending = bookings.filter(b => b.status === 'PENDING').length
  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length
  const completed = bookings.filter(b => b.status === 'COMPLETED').length
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length

  // Page 1: Cover & Summary
  let y = addHeader(doc, 'รายงานการจองคิว', `ข้อมูล ณ วันที่ ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} | ทั้งหมด ${total} รายการ`)

  y = addSummaryCards(doc, y, [
    { label: 'ทั้งหมด', value: String(total), color: BRAND_DARK },
    { label: 'รอยืนยัน', value: String(pending), color: '#eab308' },
    { label: 'ยืนยันแล้ว', value: String(confirmed), color: '#22c55e' },
    { label: 'เสร็จสิ้น', value: String(completed), color: '#3b82f6' },
    { label: 'ยกเลิก', value: String(cancelled), color: '#ef4444' }
  ])

  // Status distribution bar
  if (total > 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(BRAND_DARK))
    doc.text('สรุปสถานะ', 20, y)
    y += 6

    const pageWidth = doc.internal.pageSize.getWidth()
    const barWidth = pageWidth - 40
    const barHeight = 8

    const segments = [
      { count: pending, color: '#eab308' },
      { count: confirmed, color: '#22c55e' },
      { count: completed, color: '#3b82f6' },
      { count: cancelled, color: '#ef4444' }
    ]

    let barX = 20
    segments.forEach(seg => {
      if (seg.count > 0) {
        const segWidth = (seg.count / total) * barWidth
        doc.setFillColor(...hexToRgb(seg.color))
        doc.rect(barX, y, segWidth, barHeight, 'F')
        barX += segWidth
      }
    })

    // Rounded border
    doc.setDrawColor(200, 200, 200)
    doc.roundedRect(20, y, barWidth, barHeight, 2, 2, 'S')

    y += 16
  }

  // Table
  const tableData = bookings.map((b, i) => [
    String(i + 1),
    b.name,
    b.phone,
    new Date(b.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
    b.timeSlot,
    b.topic || '-',
    statusLabels[b.status] || b.status
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'ชื่อ', 'โทรศัพท์', 'วันที่', 'เวลา', 'หัวข้อ', 'สถานะ']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: hexToRgb(BRAND_COLOR),
      textColor: hexToRgb(WHITE),
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: hexToRgb(BRAND_DARK)
    },
    alternateRowStyles: {
      fillColor: hexToRgb(LIGHT_GRAY)
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      3: { halign: 'center' },
      4: { halign: 'center' },
      6: { halign: 'center' }
    },
    margin: { left: 20, right: 20 },
    didDrawPage: () => {
      addFooter(doc, pageNum)
      pageNum++
    }
  })

  // Detail pages - each booking gets a card
  if (bookings.length > 0 && bookings.length <= 20) {
    doc.addPage()
    pageNum++
    addFooter(doc, pageNum)

    let detailY = addHeader(doc, 'รายละเอียดการจอง', 'ข้อมูลเพิ่มเติมของแต่ละการจอง')

    bookings.forEach((b, i) => {
      if (detailY > 240) {
        doc.addPage()
        pageNum++
        addFooter(doc, pageNum)
        detailY = 20
      }

      // Card
      doc.setFillColor(...hexToRgb(WHITE))
      doc.setDrawColor(230, 230, 230)
      doc.roundedRect(20, detailY, doc.internal.pageSize.getWidth() - 40, 42, 3, 3, 'FD')

      // Card header
      doc.setFillColor(...hexToRgb(BRAND_COLOR))
      doc.rect(20, detailY, doc.internal.pageSize.getWidth() - 40, 10, 'F')
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...hexToRgb(WHITE))
      doc.text(`${i + 1}. ${b.name} - ${statusLabels[b.status] || b.status}`, 25, detailY + 7)

      // Card body
      const col1X = 25
      const col2X = doc.internal.pageSize.getWidth() / 2 + 5
      const bodyY = detailY + 16

      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')

      doc.setTextColor(...hexToRgb(GRAY))
      doc.text('อีเมล:', col1X, bodyY)
      doc.setTextColor(...hexToRgb(BRAND_DARK))
      doc.text(b.email, col1X + 18, bodyY)

      doc.setTextColor(...hexToRgb(GRAY))
      doc.text('โทรศัพท์:', col2X, bodyY)
      doc.setTextColor(...hexToRgb(BRAND_DARK))
      doc.text(b.phone, col2X + 22, bodyY)

      doc.setTextColor(...hexToRgb(GRAY))
      doc.text('วันที่:', col1X, bodyY + 7)
      doc.setTextColor(...hexToRgb(BRAND_DARK))
      doc.text(`${new Date(b.date).toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} เวลา ${b.timeSlot}`, col1X + 18, bodyY + 7)

      if (b.topic) {
        doc.setTextColor(...hexToRgb(GRAY))
        doc.text('หัวข้อ:', col1X, bodyY + 14)
        doc.setTextColor(...hexToRgb(BRAND_DARK))
        doc.text(b.topic, col1X + 18, bodyY + 14)
      }

      if (b.message) {
        doc.setTextColor(...hexToRgb(GRAY))
        doc.text('ข้อความ:', col1X, bodyY + 21)
        doc.setTextColor(...hexToRgb(BRAND_DARK))
        const msgLines = doc.splitTextToSize(b.message, doc.internal.pageSize.getWidth() - 100)
        doc.text(msgLines.slice(0, 2).join(' '), col1X + 22, bodyY + 21)
      }

      detailY += 48
    })
  }

  doc.save(`bookings_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

// ========== INQUIRIES REPORT ==========
export async function generateInquiriesPDF(inquiries: {
  name: string
  email: string
  phone: string | null
  interest: string
  message: string | null
  status: string
  notes: string | null
  createdAt: string
  assignedTo: { name: string } | null
  villa: { name: string } | null
}[]) {
  const doc = new jsPDF()
  let pageNum = 1

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

  const total = inquiries.length
  const newCount = inquiries.filter(i => i.status === 'NEW').length
  const inProgress = inquiries.filter(i => i.status === 'IN_PROGRESS' || i.status === 'CONTACTED').length
  const converted = inquiries.filter(i => i.status === 'CONVERTED').length
  const qualified = inquiries.filter(i => i.status === 'QUALIFIED').length

  let y = addHeader(doc, 'รายงานคำถามจากลูกค้า', `ข้อมูล ณ วันที่ ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} | ทั้งหมด ${total} รายการ`)

  y = addSummaryCards(doc, y, [
    { label: 'ทั้งหมด', value: String(total), color: BRAND_DARK },
    { label: 'ใหม่', value: String(newCount), color: '#3b82f6' },
    { label: 'กำลังดำเนินการ', value: String(inProgress), color: '#a855f7' },
    { label: 'ผ่านเกณฑ์', value: String(qualified), color: '#22c55e' },
    { label: 'สำเร็จ', value: String(converted), color: '#10b981' }
  ])

  // Interest distribution
  if (total > 0) {
    const interestCounts: Record<string, number> = {}
    inquiries.forEach(i => {
      const label = interestLabels[i.interest] || i.interest
      interestCounts[label] = (interestCounts[label] || 0) + 1
    })

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...hexToRgb(BRAND_DARK))
    doc.text('ประเภทความสนใจ', 20, y)
    y += 6

    const sortedInterests = Object.entries(interestCounts).sort((a, b) => b[1] - a[1])
    const maxCount = sortedInterests[0]?.[1] || 1
    const pageWidth = doc.internal.pageSize.getWidth()
    const barMaxWidth = pageWidth - 100

    sortedInterests.forEach(([label, count]) => {
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...hexToRgb(GRAY))
      doc.text(label, 20, y + 4)

      const barWidth = (count / maxCount) * barMaxWidth
      doc.setFillColor(...hexToRgb(BRAND_COLOR))
      doc.roundedRect(80, y - 1, barWidth, 6, 2, 2, 'F')

      doc.setTextColor(...hexToRgb(BRAND_DARK))
      doc.text(String(count), 80 + barWidth + 4, y + 4)

      y += 10
    })

    y += 8
  }

  // Table
  const tableData = inquiries.map((i, idx) => [
    String(idx + 1),
    i.name,
    i.email,
    i.phone || '-',
    interestLabels[i.interest] || i.interest,
    i.villa?.name || '-',
    statusLabels[i.status] || i.status,
    new Date(i.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
  ])

  autoTable(doc, {
    startY: y,
    head: [['#', 'ชื่อ', 'อีเมล', 'โทร', 'ความสนใจ', 'วิลล่า', 'สถานะ', 'วันที่']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: hexToRgb(BRAND_COLOR),
      textColor: hexToRgb(WHITE),
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: hexToRgb(BRAND_DARK)
    },
    alternateRowStyles: {
      fillColor: hexToRgb(LIGHT_GRAY)
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      7: { halign: 'center' }
    },
    margin: { left: 20, right: 20 },
    didDrawPage: () => {
      addFooter(doc, pageNum)
      pageNum++
    }
  })

  doc.save(`inquiries_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

// ========== DASHBOARD SUMMARY REPORT ==========
export async function generateDashboardPDF(stats: {
  totalVillas: number
  availableVillas: number
  totalBookings: number
  pendingBookings: number
  totalInquiries: number
  newInquiries: number
  totalPortfolios: number
  totalSubscribers: number
}) {
  const doc = new jsPDF()
  let pageNum = 1

  const y = addHeader(doc, 'รายงานสรุปภาพรวม', `Dashboard Summary | ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}`)

  addSummaryCards(doc, y, [
    { label: 'วิลล่าทั้งหมด', value: String(stats.totalVillas), color: BRAND_DARK },
    { label: 'ว่าง', value: String(stats.availableVillas), color: '#22c55e' },
    { label: 'ผลงาน', value: String(stats.totalPortfolios), color: '#3b82f6' },
    { label: 'ผู้ติดตาม', value: String(stats.totalSubscribers), color: '#a855f7' }
  ])

  const y2 = y + 45
  addSummaryCards(doc, y2, [
    { label: 'จองคิวทั้งหมด', value: String(stats.totalBookings), color: BRAND_DARK },
    { label: 'รอยืนยัน', value: String(stats.pendingBookings), color: '#eab308' },
    { label: 'คำถามทั้งหมด', value: String(stats.totalInquiries), color: BRAND_DARK },
    { label: 'คำถามใหม่', value: String(stats.newInquiries), color: '#ef4444' }
  ])

  // Key insights
  let insightY = y2 + 50

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...hexToRgb(BRAND_DARK))
  doc.text('สรุปประเด็นสำคัญ', 20, insightY)
  insightY += 10

  const insights = [
    { icon: '🏠', text: `มีวิลล่า ${stats.totalVillas} หลัง ว่าง ${stats.availableVillas} หลัง (${stats.totalVillas > 0 ? Math.round((stats.availableVillas / stats.totalVillas) * 100) : 0}% อัตราว่าง)` },
    { icon: '📅', text: `จองคิว ${stats.totalBookings} รายการ รอการยืนยัน ${stats.pendingBookings} รายการ` },
    { icon: '💬', text: `คำถามจากลูกค้า ${stats.totalInquiries} รายการ ใหม่ ${stats.newInquiries} รายการ` },
    { icon: '🎨', text: `ผลงานทั้งหมด ${stats.totalPortfolios} ชิ้น ผู้ติดตาม ${stats.totalSubscribers} คน` }
  ]

  insights.forEach(insight => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...hexToRgb(BRAND_DARK))
    doc.text(`${insight.icon}  ${insight.text}`, 25, insightY)
    insightY += 10
  })

  addFooter(doc, pageNum)

  doc.save(`dashboard_report_${new Date().toISOString().split('T')[0]}.pdf`)
}
