import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { ContentStatus } from '@prisma/client'

const faqSchema = z.object({
  question: z.string().min(1),
  questionEn: z.string().optional(),
  answer: z.string().min(1),
  answerEn: z.string().optional(),
  category: z.string().optional(),
  sortOrder: z.number().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'PUBLISHED'
    const category = searchParams.get('category')

    const where: Record<string, unknown> = { status: statusParam as ContentStatus }
    if (category) where.category = category

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
      const cat = faq.category || 'general'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(faq)
      return acc
    }, {} as Record<string, typeof faqs>)

    return NextResponse.json({ data: faqs, grouped })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = faqSchema.parse(body)

    const faq = await prisma.fAQ.create({
      data: {
        ...validated,
        category: validated.category || 'general',
        sortOrder: validated.sortOrder || 0,
        status: validated.status || 'PUBLISHED'
      }
    })

    return NextResponse.json({ data: faq }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating FAQ:', error)
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 })
  }
}
