import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { ContentStatus } from '@prisma/client'

const postSchema = z.object({
  title: z.string().min(1),
  titleEn: z.string().optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  excerptEn: z.string().optional(),
  content: z.string().min(1),
  contentEn: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status') || 'PUBLISHED'
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: Record<string, unknown> = { status: statusParam as ContentStatus }
    if (category) where.category = category
    if (featured === 'true') where.featured = true

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ])

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = postSchema.parse(body)

    const slug = validated.slug || validated.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const existingSlug = await prisma.post.findUnique({
      where: { slug }
    })

    if (existingSlug) {
      return NextResponse.json({ error: 'Slug นี้มีอยู่แล้ว' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        titleEn: validated.titleEn,
        slug,
        excerpt: validated.excerpt,
        excerptEn: validated.excerptEn,
        content: validated.content,
        contentEn: validated.contentEn,
        coverImage: validated.coverImage,
        category: validated.category,
        tags: validated.tags ? validated.tags.join(',') : null,
        featured: validated.featured,
        status: (validated.status || 'DRAFT') as ContentStatus,
        publishedAt: validated.status === 'PUBLISHED' ? new Date() : null
      }
    })

    return NextResponse.json({ data: post }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
