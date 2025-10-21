import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

export async function GET() {
  let client;

  try {
    if (!MONGODB_URI) {
      console.error('[API] MONGODB_URI not configured');
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 });
    }

    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db('neko-defense-system');

    // Count threat actors by category
    const threatActors = await db.collection('threat-actors').find({}).toArray();

    const counts = {
      total: threatActors.length,
      ransomware: threatActors.filter(actor =>
        actor.categories?.includes('Ransomware') ||
        actor.categories?.includes('Ransomware-as-a-Service')
      ).length,
      apt: threatActors.filter(actor =>
        actor.categories?.includes('APT') ||
        actor.threat_level === 'CRITICAL'
      ).length,
      financial: threatActors.filter(actor =>
        actor.categories?.includes('Financial Crime') ||
        actor.categories?.includes('Cryptocurrency Theft')
      ).length,
      state_sponsored: threatActors.filter(actor =>
        actor.categories?.includes('State-Sponsored Hacking') ||
        actor.categories?.includes('Espionage')
      ).length
    };

    return NextResponse.json({
      success: true,
      data: counts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[API] Threat counts error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch threat counts',
      details: error.message
    }, { status: 500 });

  } finally {
    if (client) {
      await client.close();
    }
  }
}
