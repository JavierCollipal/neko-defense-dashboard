// 🐾💀 NEKO DEFENSE DASHBOARD - Deceased Officers API Route
// Next.js API route to fetch deceased Carabineros officers from MongoDB Atlas
// Part of the Deceased Carabineros Intelligence System

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('⚠️ MONGODB_URI not configured!');
}

// GET /api/deceased-officers
export async function GET(request) {
  // Return empty array if MongoDB URI not configured (dev/demo mode)
  if (!MONGODB_URI) {
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      message: 'Demo mode - MongoDB not configured'
    });
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('deceased-officers');

    // Fetch all deceased officers, sorted by date of death (most recent first)
    const deceasedOfficers = await collection
      .find({})
      .sort({ date_of_death: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: deceasedOfficers,
      count: deceasedOfficers.length
    });

  } catch (error) {
    console.error('❌ API Error (deceased-officers):', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        message: 'Failed to fetch deceased officers'
      },
      { status: 500 }
    );

  } finally {
    await client.close();
  }
}
