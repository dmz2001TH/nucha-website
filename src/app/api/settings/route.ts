import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'JSON', 'IMAGE', 'COLOR']).optional(),
  group: z.string().optional(),
  label: z.string().min(1),
  labelEn: z.string().optional()
})

// GET - List all settings or get by group
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    const where: Record<string, unknown> = {}
    if (group) where.group = group
    if (key) where.key = key

    // Initialize default settings only if missing (check once, skip if all exist)
    const defaultSettings: { key: string; value: string; type: 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'COLOR' | 'BOOLEAN' | 'NUMBER' | 'JSON'; group: string; label: string }[] = [
      { key: 'nav_home', value: 'หน้าแรก', type: 'TEXT', group: 'nav', label: 'เมนู: หน้าแรก' },
      { key: 'nav_services', value: 'บริการ', type: 'TEXT', group: 'nav', label: 'เมนู: บริการ' },
      { key: 'nav_villas', value: 'วิลล่า', type: 'TEXT', group: 'nav', label: 'เมนู: วิลล่า' },
      { key: 'nav_portfolio', value: 'ผลงาน', type: 'TEXT', group: 'nav', label: 'เมนู: ผลงาน' },
      { key: 'nav_philosophy', value: 'ปรัชญา', type: 'TEXT', group: 'nav', label: 'เมนู: ปรัชญา' },
      { key: 'nav_contact', value: 'ติดต่อเรา', type: 'TEXT', group: 'nav', label: 'เมนู: ติดต่อเรา' },
      { key: 'nav_booking', value: 'จองคิว', type: 'TEXT', group: 'nav', label: 'ปุ่ม: จองคิว' },
      { key: 'footer_description', value: 'ออกแบบบ้านหรูในพัทยา ด้วยมาตรฐานระดับสากล', type: 'TEXTAREA', group: 'footer', label: 'คำอธิบายใน Footer' },
      { key: 'hero_brand', value: 'NUCHA VILL.', type: 'TEXT', group: 'hero', label: 'ชื่อแบรนด์ใน Hero' },
      { key: 'hero_brand_highlight', value: 'VILL.', type: 'TEXT', group: 'hero', label: 'ส่วนไฮไลต์สีแดงใน Hero' },
      { key: 'hero_tagline', value: 'สถาปัตยกรรมแห่งอนาคต', type: 'TEXT', group: 'hero', label: 'Tagline ใต้โลโก้' },
      { key: 'hero_description', value: 'การผสมผสานความหรูหราเข้ากับความแม่นยำทางวิศวกรรม สร้างสรรค์พื้นที่อยู่อาศัยที่อยู่เหนือความคาดหมายในพัทยา', type: 'TEXTAREA', group: 'hero', label: 'คำอธิบายหน้าแรก' },
      { key: 'hero_stat1_value', value: '10+', type: 'TEXT', group: 'hero', label: 'สถิติที่ 1 (ตัวเลข)' },
      { key: 'hero_stat1_label', value: 'ปีประสบการณ์', type: 'TEXT', group: 'hero', label: 'สถิติที่ 1 (ข้อความ)' },
      { key: 'hero_stat2_value', value: '50+', type: 'TEXT', group: 'hero', label: 'สถิติที่ 2 (ตัวเลข)' },
      { key: 'hero_stat2_label', value: 'โครงการสำเร็จ', type: 'TEXT', group: 'hero', label: 'สถิติที่ 2 (ข้อความ)' },
      { key: 'hero_sidebar_project', value: 'เดอะ โมโนลิธ เฮาส์', type: 'TEXT', group: 'hero', label: 'ชื่อโปรเจกต์ใน Hero (sidebar)' },
      { key: 'hero_sidebar_status', value: 'เสร็จสิ้น 2024', type: 'TEXT', group: 'hero', label: 'สถานะโปรเจกต์ใน Hero (sidebar)' },
      { key: 'hero_image', value: 'https://console.baanmaevilla.com/uploads/LINE_ALBUM_6_Type_B_18_182a78a5c2.jpg', type: 'IMAGE', group: 'hero', label: 'รูปพื้นหลัง Hero' },
    ]
    const defaultKeys = defaultSettings.map(s => s.key)
    const existingKeys = await prisma.setting.findMany({ where: { key: { in: defaultKeys } }, select: { key: true } })
    const existingKeySet = new Set(existingKeys.map(s => s.key))
    const missing = defaultSettings.filter(s => !existingKeySet.has(s.key))
    if (missing.length > 0) {
      await prisma.setting.createMany({ data: missing, skipDuplicates: true })
    }

    // Initialize notification settings if not exists
    const notificationSettings = await prisma.setting.findMany({
      where: { group: 'notification' }
    })

    if (notificationSettings.length === 0) {
      await prisma.setting.createMany({
        data: [
          {
            key: 'line_notify_token',
            value: '',
            type: 'TEXT',
            group: 'notification',
            label: 'LINE Notify Token'
          },
          {
            key: 'line_notify_enabled',
            value: 'false',
            type: 'BOOLEAN',
            group: 'notification',
            label: 'เปิดใช้ LINE Notify'
          },
          {
            key: 'email_notification',
            value: 'true',
            type: 'BOOLEAN',
            group: 'notification',
            label: 'ส่งอีเมลแจ้งเตือน'
          }
        ]
      })
    }

    // Initialize chat settings if not exists
    const chatSettings = await prisma.setting.findMany({
      where: { group: 'chat' }
    })

    if (chatSettings.length === 0) {
      await prisma.setting.createMany({
        data: [
          {
            key: 'line_id',
            value: '',
            type: 'TEXT',
            group: 'chat',
            label: 'LINE ID'
          },
          {
            key: 'whatsapp_number',
            value: '',
            type: 'TEXT',
            group: 'chat',
            label: 'WhatsApp Number'
          }
        ]
      })
    }

    // Initialize analytics settings if not exists
    const analyticsSettings = await prisma.setting.findMany({
      where: { group: 'analytics' }
    })

    if (analyticsSettings.length === 0) {
      await prisma.setting.createMany({
        data: [
          {
            key: 'google_analytics_id',
            value: '',
            type: 'TEXT',
            group: 'analytics',
            label: 'Google Analytics ID (G-XXXXXXXXXX)'
          },
          {
            key: 'google_site_verification',
            value: '',
            type: 'TEXT',
            group: 'analytics',
            label: 'Google Site Verification'
          }
        ]
      })
    }

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }]
    })

    return NextResponse.json({ data: settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST - Create or update setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = settingSchema.parse(body)

    const setting = await prisma.setting.upsert({
      where: { key: validated.key },
      update: {
        value: validated.value,
        type: validated.type || 'TEXT',
        group: validated.group || 'general',
        label: validated.label,
        labelEn: validated.labelEn
      },
      create: {
        ...validated,
        type: validated.type || 'TEXT',
        group: validated.group || 'general'
      }
    })

    return NextResponse.json({ data: setting }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error saving setting:', error)
    return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
  }
}

// PUT - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const settings = body.settings

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 })
    }

    const results = await Promise.all(
      settings.map(async (setting: { key: string; value: string }) => {
        return prisma.setting.update({
          where: { key: setting.key },
          data: { value: setting.value }
        })
      })
    )

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
