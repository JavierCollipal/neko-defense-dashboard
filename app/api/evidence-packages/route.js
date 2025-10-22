// 🐾 NEKO DEFENSE DASHBOARD - Evidence Packages API Route
// Next.js API route to fetch evidence packages from MongoDB Atlas

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/evidence-packages
export async function GET(request) {
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('evidence-packages');

    const evidence = await collection.find({}).sort({ collected_at: -1 }).limit(100).toArray();

    return NextResponse.json({
      success: true,
      data: evidence,
      count: evidence.length
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch evidence packages'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
