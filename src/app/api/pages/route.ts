import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const pageSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  content: z.string().min(1),
  contentEn: z.string().optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

// GET - List all pages or get by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = {}
    if (slug) where.slug = slug
    if (status) where.status = status

    const pages = await prisma.page.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

// POST - Create new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = pageSchema.parse(body)

    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const page = await prisma.page.create({
      data: {
        ...validated,
        slug,
        status: validated.status || 'DRAFT'
      }
    })

    return NextResponse.json({ data: page }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
