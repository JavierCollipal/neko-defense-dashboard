// 🐾 NEKO DEFENSE DASHBOARD - Case Patterns API Route
// Next.js API route to fetch case patterns from MongoDB Atlas

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/case-patterns
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
    const collection = db.collection('case-patterns');

    const patterns = await collection.find({}).sort({ created_at: -1 }).limit(100).toArray();

    return NextResponse.json({
      success: true,
      data: patterns,
      count: patterns.length
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch case patterns'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
