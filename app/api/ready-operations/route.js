// 🐾 NEKO DEFENSE DASHBOARD - Ready Operations API Route
// Next.js API route to fetch ready operations from MongoDB Atlas

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/ready-operations
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
    const collection = db.collection('ready-operations');

    const operations = await collection.find({}).sort({ priority: -1, created_at: -1 }).limit(100).toArray();

    return NextResponse.json({
      success: true,
      data: operations,
      count: operations.length
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch ready operations'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
