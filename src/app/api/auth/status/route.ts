import { NextResponse } from 'next/server'

// Handle /api/auth/status requests (from browser extensions / old clients)
// Returns 200 to prevent NextAuth UnknownAction errors
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
