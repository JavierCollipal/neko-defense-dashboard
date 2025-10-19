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

    // Get DINA perpetrators collection
    const perpetratorsCollection = db.collection('dina-agents');
    const totalPerpetrators = await perpetratorsCollection.countDocuments();

    // Calculate statistics
    const convicted = await perpetratorsCollection.countDocuments({
      'legalStatus.convicted': true
    });

    const atLarge = await perpetratorsCollection.countDocuments({
      status: { $regex: /AT LARGE/i }
    });

    const neverProsecuted = await perpetratorsCollection.countDocuments({
      status: { $regex: /NEVER PROSECUTED/i }
    });

    const stats = {
      perpetrators: {
        total_known_agents: 1097, // 2008 Army List
        documented: totalPerpetrators,
        convicted: convicted,
        atLarge: atLarge,
        neverProsecuted: neverProsecuted
      }
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ [API] DINA stats error:', error);
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
