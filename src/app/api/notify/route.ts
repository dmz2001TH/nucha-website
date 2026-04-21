import { NextResponse } from 'next/server'
import { sendTestLineNotify } from '@/lib/notification'

export async function POST() {
  const result = await sendTestLineNotify()
  return NextResponse.json(result)
}
