// 🐾 NEKO DEFENSE DASHBOARD - DINA Brigades API Route
// Next.js API route to fetch DINA brigade structures from MongoDB Atlas

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

// GET /api/dina-brigades
export async function GET(request) {
  // Return mock data if MongoDB URI not configured
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
    const collection = db.collection('dina_brigades_structure');

    // Fetch all brigade structures
    const brigades = await collection.find({}).toArray();

    return NextResponse.json({
      success: true,
      data: brigades,
      count: brigades.length
    });

  } catch (error) {
    console.error('❌ API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch DINA brigades'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
