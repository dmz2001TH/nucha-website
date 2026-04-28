import { NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Fetch projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, location, image_url, category, status, featured } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO projects (title, description, price, location, image_url, category, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(
      title,
      description || null,
      price || null,
      location || null,
      image_url || null,
      category || null,
      status || 'available',
      featured || 0
    );

    return NextResponse.json({
      message: 'Project created',
      projectId: result.lastInsertRowid,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
