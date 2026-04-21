import prisma from '@/lib/prisma'

async function getLineNotifyToken(): Promise<string | null> {
  try {
    const [tokenSetting, enabledSetting] = await Promise.all([
      prisma.setting.findUnique({
        where: { key: 'line_notify_token' }
      }),
      prisma.setting.findUnique({
        where: { key: 'line_notify_enabled' }
      })
    ])

    // ตรวจสอบว่าเปิดใช้งานอยู่หรือไม่
    if (enabledSetting?.value !== 'true') {
      return null
    }

    return tokenSetting?.value || null
  } catch {
    return null
  }
}

interface LineNotifyData {
  name: string
  phone: string
  date: string
  timeSlot: string
  topic?: string
  message?: string
}

export async function sendLineNotify(data: LineNotifyData) {
  const lineToken = await getLineNotifyToken()

  if (!lineToken) {
    console.log('LINE Notify token not set, skipping notification')
    return false
  }

  const formattedDate = new Date(data.date).toLocaleDateString('th-TH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  const message = `
🔔 มีการจองคิวใหม่!

👤 ชื่อ: ${data.name}
📞 โทร: ${data.phone}
📅 วันที่: ${formattedDate}
⏰ เวลา: ${data.timeSlot}
${data.topic ? `📋 หัวข้อ: ${data.topic}` : ''}
${data.message ? `💬 ข้อความ: ${data.message}` : ''}

จัดการที่: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/bookings
  `.trim()

  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineToken}`
      },
      body: `message=${encodeURIComponent(message)}`
    })

    return response.ok
  } catch (error) {
    console.error('Error sending LINE notification:', error)
    return false
  }
}

interface InquiryNotifyData {
  name: string
  email: string
  phone?: string
  interest: string
  message?: string
}

export async function sendLineNotifyInquiry(data: InquiryNotifyData) {
  const lineToken = await getLineNotifyToken()

  if (!lineToken) {
    return false
  }

  const interestLabels: Record<string, string> = {
    'RESIDENTIAL_DESIGN': 'ออกแบบบ้านพักอาศัย',
    'COMMERCIAL_PROJECT': 'โครงการพาณิชย์',
    'INTERIOR_CONSULTATION': 'ปรึกษาออกแบบภายใน',
    'VILLA_PURCHASE': 'ซื้อวิลล่า',
    'GENERAL_INQUIRY': 'สอบถามทั่วไป'
  }

  const message = `
📬 มีคำถามใหม่!

👤 ชื่อ: ${data.name}
✉️ อีเมล: ${data.email}
${data.phone ? `📞 โทร: ${data.phone}` : ''}
🏷️ ความสนใจ: ${interestLabels[data.interest] || data.interest}
${data.message ? `💬 ข้อความ: ${data.message}` : ''}

จัดการที่: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/inquiries
  `.trim()

  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineToken}`
      },
      body: `message=${encodeURIComponent(message)}`
    })

    return response.ok
  } catch (error) {
    console.error('Error sending LINE notification:', error)
    return false
  }
}

export async function sendTestLineNotify() {
  const lineToken = await getLineNotifyToken()

  if (!lineToken) {
    return { success: false, message: 'ไม่พบ LINE Notify Token กรุณาตั้งค่าก่อน' }
  }

  const message = `
✅ ทดสอบการแจ้งเตือนสำเร็จ!

ระบบแจ้งเตือน LINE ทำงานปกติ
เวลา: ${new Date().toLocaleString('th-TH')}
  `.trim()

  try {
    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineToken}`
      },
      body: `message=${encodeURIComponent(message)}`
    })

    if (response.ok) {
      return { success: true, message: 'ส่งข้อความทดสอบสำเร็จ!' }
    } else {
      return { success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' }
    }
  } catch {
    return { success: false, message: 'เกิดข้อผิดพลาดในการส่ง' }
  }
}
