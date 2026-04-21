import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const serviceSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  coverImage: z.string().optional(),
  sortOrder: z.number().int().optional(),
  features: z.string().optional(),
  whyChooseUs: z.string().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')

    if (slug) {
      const service = await prisma.service.findUnique({ where: { slug } })
      if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
      return NextResponse.json({ data: service })
    }

    if (id) {
      const service = await prisma.service.findUnique({ where: { id } })
      if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 })
      return NextResponse.json({ data: service })
    }

    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json({ data: services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = serviceSchema.parse(body)

    const slug = validated.slug || validated.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9ก-๙-]/g, '')

    const service = await prisma.service.create({
      data: {
        title: validated.title,
        titleEn: validated.titleEn,
        slug,
        description: validated.description || '',
        descriptionEn: validated.descriptionEn || null,
        icon: validated.icon || '',
        status: validated.status || 'DRAFT',
        sortOrder: validated.sortOrder || 0,
        coverImage: validated.coverImage || null,
        features: validated.features || null,
        whyChooseUs: validated.whyChooseUs || null
      }
    })

    return NextResponse.json({ data: service }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const validated = serviceSchema.parse(body)

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: validated.title,
        titleEn: validated.titleEn,
        description: validated.description || '',
        descriptionEn: validated.descriptionEn || null,
        icon: validated.icon || '',
        status: validated.status || 'DRAFT',
        sortOrder: validated.sortOrder || 0,
        coverImage: validated.coverImage || null,
        features: validated.features || null,
        whyChooseUs: validated.whyChooseUs || null
      }
    })

    return NextResponse.json({ data: service })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating service:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}