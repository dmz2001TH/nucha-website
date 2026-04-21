import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { InquiryStatus, InquiryInterest } from '@prisma/client'

const inquiryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  interest: z.nativeEnum(InquiryInterest).optional(),
  message: z.string().optional(),
  status: z.nativeEnum(InquiryStatus).optional(),
  notes: z.string().optional(),
  assignedToId: z.string().optional().nullable(),
  villaId: z.string().optional().nullable()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        villa: { select: { id: true, name: true, slug: true } }
      }
    })

    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 })
    }

    return NextResponse.json({ data: inquiry })
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiry' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = inquiryUpdateSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    if (validated.name !== undefined) updateData.name = validated.name
    if (validated.email !== undefined) updateData.email = validated.email
    if (validated.phone !== undefined) updateData.phone = validated.phone
    if (validated.interest !== undefined) updateData.interest = validated.interest
    if (validated.message !== undefined) updateData.message = validated.message
    if (validated.status !== undefined) updateData.status = validated.status
    if (validated.notes !== undefined) updateData.notes = validated.notes
    if (validated.assignedToId !== undefined) updateData.assignedToId = validated.assignedToId === null ? undefined : validated.assignedToId
    if (validated.villaId !== undefined) updateData.villaId = validated.villaId === null ? undefined : validated.villaId

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        villa: { select: { id: true, name: true, slug: true } }
      }
    })

    return NextResponse.json({ data: inquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = inquiryUpdateSchema.parse(body)

    if (!validated.name || !validated.email || !validated.interest) {
      return NextResponse.json(
        { error: 'name, email, and interest are required' },
        { status: 400 }
      )
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone ?? undefined,
        interest: validated.interest,
        message: validated.message ?? undefined,
        status: validated.status ?? InquiryStatus.NEW,
        notes: validated.notes ?? undefined,
        assignedToId: validated.assignedToId === null ? undefined : validated.assignedToId,
        villaId: validated.villaId === null ? undefined : validated.villaId
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        villa: { select: { id: true, name: true, slug: true } }
      }
    })

    return NextResponse.json({ data: inquiry })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error updating inquiry:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.inquiry.delete({ where: { id } })
    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }
}
