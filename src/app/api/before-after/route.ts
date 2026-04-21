import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { ContentStatus } from '@prisma/client'

const beforeAfterSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  beforeImage: z.string().min(1),
  afterImage: z.string().min(1),
  projectId: z.string().optional(),
  sortOrder: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'PUBLISHED'
    const limit = parseInt(searchParams.get('limit') || '20')

    const items = await prisma.beforeAfter.findMany({
      where: { status: statusParam as ContentStatus },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({ data: items })
  } catch (error) {
    console.error('Error fetching before-after items:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = beforeAfterSchema.parse(body)

    const item = await prisma.beforeAfter.create({
      data: validated
    })

    return NextResponse.json({ data: item }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating before-after:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
