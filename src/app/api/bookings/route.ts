import { NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();
    
    let bookings;
    if (session.role === 'admin') {
      bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    } else {
      bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(session.id);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, date, time, name, email, phone, notes } = body;

    if (!service || !date || !time || !name || !email) {
      return NextResponse.json(
        { error: 'Service, date, time, name, and email are required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const session = await getSession();

    const result = db.prepare(
      'INSERT INTO bookings (user_id, service, booking_date, booking_time, name, email, phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      session?.id || null,
      service,
      date,
      time,
      name,
      email,
      phone || null,
      notes || null
    );

    return NextResponse.json({
      message: 'Booking created successfully',
      bookingId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
