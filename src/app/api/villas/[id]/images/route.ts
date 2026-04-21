import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  altEn: z.string().optional(),
  sortOrder: z.number().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = imageSchema.parse(body)

    const villa = await prisma.villa.findUnique({ where: { id } })
    if (!villa) {
      return NextResponse.json({ error: 'Villa not found' }, { status: 404 })
    }

    const image = await prisma.villaImage.create({
      data: {
        url: validated.url,
        alt: validated.alt || null,
        altEn: validated.altEn || null,
        sortOrder: validated.sortOrder || 0,
        villaId: id
      }
    })

    return NextResponse.json({ data: image }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating villa image:', error)
    return NextResponse.json({ error: 'Failed to create image' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const images = await prisma.villaImage.findMany({
      where: { villaId: id },
      orderBy: { sortOrder: 'asc' }
    })
    return NextResponse.json({ data: images })
  } catch (error) {
    console.error('Error fetching villa images:', error)
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 })
  }
}