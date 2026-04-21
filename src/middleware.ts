import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 60
const API_RATE_LIMIT = 30

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return `${ip}:${request.nextUrl.pathname}`
}

function checkRateLimit(key: string, limit: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting สำหรับ API routes (ยกเว้น /api/auth/* เพราะ NextAuth เรียกบ่อย)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    const key = getRateLimitKey(request)
    if (!checkRateLimit(key, API_RATE_LIMIT)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // Rate limiting เฉพาะ signin endpoint เพื่อป้องกัน brute force
  // ไม่รวม /api/auth/session เพราะ SessionProvider เรียกบ่อย
  const isSignInEndpoint = pathname === '/api/auth/signin' || pathname === '/api/auth/callback/credentials'
  if (isSignInEndpoint || pathname === '/admin/login') {
    const key = getRateLimitKey(request)
    if (!checkRateLimit(key, 10)) { // 10 attempts ต่อนาที
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }
  }

  // Admin auth check
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin/register' || pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }

    const sessionToken =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value

    if (!sessionToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Security headers
  const response = NextResponse.next()

  // ป้องกัน clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // ป้องกัน MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // ป้องกัน XSS
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
