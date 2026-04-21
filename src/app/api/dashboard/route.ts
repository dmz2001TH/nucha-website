import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET - Dashboard statistics
export async function GET() {
  try {
    const [
      totalPortfolios,
      totalVillas,
      totalInquiries,
      totalBookings,
      totalMedia,
      totalServices,
      recentInquiries,
      recentBookings,
      inquiryStats,
      villaStats,
      bookingStats
    ] = await Promise.all([
      // Total counts
      prisma.portfolio.count(),
      prisma.villa.count(),
      prisma.inquiry.count(),
      prisma.booking.count(),
      prisma.media.count(),
      prisma.service.count(),
      
      // Recent inquiries (last 5)
      prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          interest: true,
          status: true,
          createdAt: true
        }
      }),

      // Recent bookings (last 5)
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          date: true,
          timeSlot: true,
          status: true,
          createdAt: true
        }
      }),
      
      // Inquiry stats by status
      prisma.inquiry.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      
      // Villa stats by status
      prisma.villa.groupBy({
        by: ['status'],
        _count: { id: true }
      }),

      // Booking stats by status
      prisma.booking.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ])

    // Calculate dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    // Get monthly stats
    const [newInquiriesThisMonth, newBookingsThisMonth, newBookingsThisWeek] = await Promise.all([
      prisma.inquiry.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.booking.count({
        where: { createdAt: { gte: startOfMonth } }
      }),
      prisma.booking.count({
        where: { createdAt: { gte: startOfWeek } }
      })
    ])

    // Get upcoming bookings
    const upcomingBookings = await prisma.booking.findMany({
      where: {
        date: { gte: now },
        status: { in: ['PENDING', 'CONFIRMED'] }
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: {
        id: true,
        name: true,
        date: true,
        timeSlot: true,
        status: true
      }
    })

    // Format stats
    const formattedInquiryStats = inquiryStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id
      return acc
    }, {} as Record<string, number>)

    const formattedVillaStats = villaStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id
      return acc
    }, {} as Record<string, number>)

    const formattedBookingStats = bookingStats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.id
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      data: {
        totals: {
          portfolios: totalPortfolios,
          villas: totalVillas,
          inquiries: totalInquiries,
          bookings: totalBookings,
          media: totalMedia,
          services: totalServices
        },
        inquiries: {
          newThisMonth: newInquiriesThisMonth,
          byStatus: formattedInquiryStats,
          recent: recentInquiries
        },
        bookings: {
          newThisMonth: newBookingsThisMonth,
          newThisWeek: newBookingsThisWeek,
          byStatus: formattedBookingStats,
          recent: recentBookings,
          upcoming: upcomingBookings
        },
        villas: {
          byStatus: formattedVillaStats
        }
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
