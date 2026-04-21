import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const villaSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional(),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  location: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().optional(),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  area: z.number().positive(),
  landArea: z.number().positive(),
  floors: z.number().int().positive().optional(),
  parking: z.number().int().min(0).optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'UNDER_CONSTRUCTION']).optional(),
  featured: z.boolean().optional(),
  coverImage: z.string().url(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
})

// GET - List all villas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const slug = searchParams.get('slug')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const bedrooms = searchParams.get('bedrooms')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (featured) where.featured = featured === 'true'
    if (slug) where.slug = slug
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice)
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice)
    }
    if (bedrooms) where.bedrooms = parseInt(bedrooms)

    const [villas, total] = await Promise.all([
      prisma.villa.findMany({
        where,
        include: { images: true, features: true },
        orderBy: { sortOrder: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.villa.count({ where })
    ])

    return NextResponse.json({
      data: villas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching villas:', error)
    return NextResponse.json({ data: [] })
  }
}

// POST - Create new villa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = villaSchema.parse(body)

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const villa = await prisma.villa.create({
      data: {
        ...validated,
        slug,
        currency: validated.currency || 'THB',
        status: validated.status || 'AVAILABLE',
        featured: validated.featured || false,
        floors: validated.floors || 1,
        parking: validated.parking || 0
      },
      include: { images: true, features: true }
    })

    return NextResponse.json({ data: villa }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating villa:', error)
    return NextResponse.json({ error: 'Failed to create villa' }, { status: 500 })
  }
}
