import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params
    
    const image = await prisma.villaImage.findFirst({
      where: { id: imageId, villaId: id }
    })
    
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    await prisma.villaImage.delete({ where: { id: imageId } })

    return NextResponse.json({ message: 'Deleted' })
  } catch (error) {
    console.error('Error deleting villa image:', error)
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
  }
}