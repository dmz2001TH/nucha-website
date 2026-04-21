import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { ContentStatus } from '@prisma/client'

const reviewSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional(),
  role: z.string().optional(),
  roleEn: z.string().optional(),
  content: z.string().min(1),
  contentEn: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  avatar: z.string().optional(),
  projectId: z.string().optional(),
  featured: z.boolean().optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'PUBLISHED'
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = { status: statusParam as ContentStatus }
    if (featured === 'true') where.featured = true

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({ data: reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = reviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        ...validated,
        rating: validated.rating || 5
      }
    })

    return NextResponse.json({ data: review }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
