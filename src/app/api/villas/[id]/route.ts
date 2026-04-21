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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const villa = await prisma.villa.findUnique({
      where: { id },
      include: { images: true, features: true }
    })

    if (!villa) {
      return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
    }

    return NextResponse.json({ data: villa })
  } catch (error) {
    console.error('Error fetching villa:', error)
    return NextResponse.json({ error: 'Failed to fetch villa' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = villaSchema.parse(body)

    const villa = await prisma.villa.update({
      where: { id },
      data: {
        ...validated,
        currency: validated.currency || 'THB',
        status: validated.status || 'AVAILABLE',
        featured: validated.featured || false,
        floors: validated.floors || 1,
        parking: validated.parking || 0
      },
      include: { images: true, features: true }
    })

    return NextResponse.json({ data: villa })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating villa:', error)
    return NextResponse.json({ error: 'Failed to update villa' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.villa.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting villa:', error)
    return NextResponse.json({ error: 'Failed to delete villa' }, { status: 500 })
  }
}
