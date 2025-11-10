import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const asciiArt = `
 ╔═══════════════════════════════════════════════════════════════════════╗
 ║                                                                       ║
 ║   ███╗   ██╗███████╗██╗  ██╗ ██████╗        █████╗ ██████╗  ██████╗ ║
 ║   ████╗  ██║██╔════╝██║ ██╔╝██╔═══██╗      ██╔══██╗██╔══██╗██╔════╝ ║
 ║   ██╔██╗ ██║█████╗  █████╔╝ ██║   ██║█████╗███████║██████╔╝██║      ║
 ║   ██║╚██╗██║██╔══╝  ██╔═██╗ ██║   ██║╚════╝██╔══██║██╔══██╗██║      ║
 ║   ██║ ╚████║███████╗██║  ██╗╚██████╔╝      ██║  ██║██║  ██║╚██████╗ ║
 ║   ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝       ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ║
 ║                                                                       ║
 ║             🐾 DEFENSE DASHBOARD - THREAT INTELLIGENCE 🐾             ║
 ║                                                                       ║
 ╚═══════════════════════════════════════════════════════════════════════╝
    `;

    return NextResponse.json({
      ascii: asciiArt,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] ASCII Art error:', error);
    return NextResponse.json(
      { error: 'Failed to generate ASCII art' },
      { status: 500 }
    );
  }
}
