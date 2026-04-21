import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email'
import { sendLineNotify } from '@/lib/notification'

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  date: z.string().transform((str) => new Date(str)),
  timeSlot: z.string().min(1),
  topic: z.string().optional(),
  message: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const date = searchParams.get('date')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (date) where.date = new Date(date)

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.booking.count({ where })
    ])

    return NextResponse.json({
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = bookingSchema.parse(body)

    const booking = await prisma.booking.create({
      data: validated
    })

    // ส่งอีเมลยืนยันให้ลูกค้า
    sendBookingConfirmation({
      name: validated.name,
      email: validated.email,
      date: validated.date.toISOString(),
      timeSlot: validated.timeSlot,
      topic: validated.topic
    }).catch(err => console.error('Email error:', err))

    // แจ้งเตือนแอดมิน
    sendAdminNotification({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      date: validated.date.toISOString(),
      timeSlot: validated.timeSlot,
      topic: validated.topic,
      message: validated.message
    }).catch(err => console.error('Admin email error:', err))

    // แจ้งเตือน LINE
    sendLineNotify({
      name: validated.name,
      phone: validated.phone,
      date: validated.date.toISOString(),
      timeSlot: validated.timeSlot,
      topic: validated.topic,
      message: validated.message
    }).catch(err => console.error('LINE error:', err))

    return NextResponse.json({ data: booking }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
