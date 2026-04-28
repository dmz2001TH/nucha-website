import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const services = db.prepare('SELECT * FROM services ORDER BY id').all();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Fetch services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
