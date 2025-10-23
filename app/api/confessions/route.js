// 🐾📝 NEKO DEFENSE - Confessions API Route
// Next.js API route to fetch approved confessions from MongoDB Atlas
// Public access for viewing community reports

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/confessions?category=all
export async function GET(request) {
  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'all';

  // Return demo data if MongoDB URI not configured
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: [
        {
          confession_id: 'demo_1',
          category: 'predators',
          title: 'Demo Confession',
          description: 'This is a demo confession for testing purposes.',
          threat_actor_name: 'Demo Actor',
          threat_actor_location: 'Demo Location',
          submitted_by: 'Anonymous',
          submitted_at: new Date().toISOString(),
          status: 'approved',
          views: 100,
          upvotes: 10,
          evidence_links: []
        }
      ],
      count: 1,
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('confessions');

    // Build query filter
    const filter = { status: 'approved' };

    if (category !== 'all') {
      filter.category = category;
    }

    // Fetch approved confessions, sorted by date (newest first)
    const confessions = await collection
      .find(filter)
      .sort({ submitted_at: -1 })
      .toArray();

    console.log(`✅ [Confessions API] Retrieved ${confessions.length} confessions (category: ${category})`);

    return NextResponse.json({
      success: true,
      data: confessions,
      count: confessions.length
    });

  } catch (error) {
    console.error('❌ [Confessions API] Failed to fetch confessions:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch confessions'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
