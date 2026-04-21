import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const portfolioSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  location: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  category: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INTERIOR', 'ARCHITECTURE']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  coverImage: z.string().url(),
  sortOrder: z.number().int().optional()
})

// GET - List all portfolios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (status) where.status = status
    if (featured) where.featured = featured === 'true'

    const [portfolios, total] = await Promise.all([
      prisma.portfolio.findMany({
        where,
        include: { images: true },
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.portfolio.count({ where })
    ])

    return NextResponse.json({
      data: portfolios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching portfolios:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

// POST - Create new portfolio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = portfolioSchema.parse(body)

    // Generate slug from title
    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const portfolio = await prisma.portfolio.create({
      data: {
        ...validated,
        slug,
        status: validated.status || 'DRAFT',
        featured: validated.featured || false,
        sortOrder: validated.sortOrder || 0
      },
      include: { images: true }
    })

    return NextResponse.json({ data: portfolio }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating portfolio:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
