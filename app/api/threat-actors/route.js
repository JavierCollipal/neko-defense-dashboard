// 🐾 NEKO DEFENSE DASHBOARD - Threat Actors API Route
// Next.js API route to fetch threat actors from MongoDB Atlas
// Replaces external GraphQL API for Vercel deployment

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/threat-actors
export async function GET(request) {
  // Return mock data if MongoDB URI not configured (dev/demo mode)
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: [
        {
          _id: 'demo1',
          name: 'Demo Threat Actor',
          threat_level: 'MEDIUM',
          origin: { country: 'Unknown' },
          categories: ['Demo'],
          status: 'active'
        }
      ],
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('threat-actors');

    // Fetch all threat actors
    const threatActors = await collection.find({}).toArray();

    return NextResponse.json({
      success: true,
      data: threatActors,
      count: threatActors.length
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch threat actors'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
