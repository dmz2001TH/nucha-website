import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = subscribeSchema.parse(body)

    // ตรวจสอบว่ามี email อยู่แล้วหรือไม่
    const existing = await prisma.subscriber.findUnique({
      where: { email: validated.email }
    })

    if (existing) {
      if (existing.status === 'UNSUBSCRIBED') {
        // กลับมาเป็น active
        await prisma.subscriber.update({
          where: { id: existing.id },
          data: { status: 'ACTIVE' }
        })
        return NextResponse.json({ message: 'กลับมาเป็นสมาชิกสำเร็จ!' })
      }
      return NextResponse.json({ message: 'คุณเป็นสมาชิกอยู่แล้ว' })
    }

    await prisma.subscriber.create({
      data: {
        email: validated.email,
        name: validated.name,
        status: 'ACTIVE',
        source: 'website'
      }
    })

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ!' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'อีเมลไม่ถูกต้อง' }, { status: 400 })
    }
    console.error('Error subscribing:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'กรุณาระบุอีเมล' }, { status: 400 })
    }

    await prisma.subscriber.updateMany({
      where: { email },
      data: { status: 'UNSUBSCRIBED' }
    })

    return NextResponse.json({ message: 'ยกเลิกการเป็นสมาชิกสำเร็จ' })
  } catch (error) {
    console.error('Error unsubscribing:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
