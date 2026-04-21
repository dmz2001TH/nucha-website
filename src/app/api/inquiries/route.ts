import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { sendLineNotifyInquiry } from '@/lib/notification'

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  interest: z.enum(['RESIDENTIAL_DESIGN', 'COMMERCIAL_PROJECT', 'INTERIOR_CONSULTATION', 'VILLA_PURCHASE', 'GENERAL_INQUIRY']),
  message: z.string().optional(),
  source: z.string().optional(),
  villaId: z.string().optional()
})

// GET - List all inquiries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const interest = searchParams.get('interest')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (interest) where.interest = interest

    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        include: { 
          assignedTo: { select: { id: true, name: true, email: true } },
          villa: { select: { id: true, name: true, slug: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.inquiry.count({ where })
    ])

    return NextResponse.json({
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

// POST - Create new inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = inquirySchema.parse(body)

    const inquiry = await prisma.inquiry.create({
      data: {
        ...validated,
        status: 'NEW',
        source: validated.source || 'website'
      },
      include: { 
        assignedTo: { select: { id: true, name: true, email: true } },
        villa: { select: { id: true, name: true, slug: true } }
      }
    })

    // แจ้งเตือน LINE
    sendLineNotifyInquiry({
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      interest: validated.interest,
      message: validated.message
    }).catch(err => console.error('LINE error:', err))

    return NextResponse.json({ data: inquiry }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating inquiry:', error)
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 })
  }
}
