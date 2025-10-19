import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
  if (!MONGODB_URI) {
    return NextResponse.json(
      { success: false, error: 'MongoDB URI not configured' },
      { status: 500 }
    );
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db('neko-defense-system');

    // Get all DINA perpetrators
    const perpetrators = await db
      .collection('dina-agents')
      .find({})
      .toArray();

    return NextResponse.json({
      success: true,
      count: perpetrators.length,
      data: perpetrators
    });

  } catch (error) {
    console.error('❌ [API] DINA perpetrators error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}
