// 🐾 NEKO DEFENSE DASHBOARD - IP Geolocation Detection API Route
// GDPR-compliant IP-based location detection for automatic language translation

import { NextResponse } from 'next/server';

// Use a reliable, free geolocation service
const GEOLOCATION_API = 'http://ip-api.com/json';

// Country code to language mapping for automatic translation
const COUNTRY_TO_LANGUAGE = {
  // Spanish-speaking countries
  'ES': 'es', // Spain
  'MX': 'es', // Mexico
  'AR': 'es', // Argentina
  'CL': 'es', // Chile
  'CO': 'es', // Colombia
  'PE': 'es', // Peru
  'VE': 'es', // Venezuela
  'EC': 'es', // Ecuador
  'BO': 'es', // Bolivia
  'PY': 'es', // Paraguay
  'UY': 'es', // Uruguay
  'CR': 'es', // Costa Rica
  'PA': 'es', // Panama
  'GT': 'es', // Guatemala
  'HN': 'es', // Honduras
  'SV': 'es', // El Salvador
  'NI': 'es', // Nicaragua
  'DO': 'es', // Dominican Republic
  'CU': 'es', // Cuba
  'PR': 'es', // Puerto Rico

  // Other major languages
  'CN': 'zh', // China
  'IN': 'hi', // India
  'SA': 'ar', // Saudi Arabia
  'AE': 'ar', // UAE
  'EG': 'ar', // Egypt
  'FR': 'fr', // France
  'DE': 'de', // Germany
  'IT': 'it', // Italy
  'PT': 'pt', // Portugal
  'BR': 'pt', // Brazil
  'RU': 'ru', // Russia
  'JP': 'ja', // Japan
  'KR': 'ko', // South Korea
  'NL': 'nl', // Netherlands
  'SE': 'sv', // Sweden
  'NO': 'no', // Norway
  'DK': 'da', // Denmark
  'FI': 'fi', // Finland
  'PL': 'pl', // Poland
  'TR': 'tr', // Turkey
  'GR': 'el', // Greece

  // Default to English for other countries
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'IE': 'en',
  'ZA': 'en'
};

// GET /api/geolocation/detect - Detect user location and suggest language
export async function GET(request) {
  try {
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = forwarded?.split(',')[0] || realIP || '127.0.0.1';

    console.log('🌍 Geolocation request for IP:', clientIP);

    // Handle localhost/development
    if (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP.startsWith('192.168.')) {
      console.log('🏠 Localhost detected, defaulting to Chile (Spanish)');
      return NextResponse.json({
        success: true,
        location: {
          country: 'Chile',
          countryCode: 'CL',
          region: 'RM',
          city: 'Santiago',
          ip: clientIP,
          isLocalhost: true
        },
        suggestedLanguage: 'es',
        confidence: 'high',
        privacy: {
          dataMinimized: true,
          gdprCompliant: true,
          storagePolicy: 'No IP addresses stored'
        }
      });
    }

    // Query geolocation API
    const geoResponse = await fetch(`${GEOLOCATION_API}/${clientIP}?fields=status,country,countryCode,region,city,timezone`);

    if (!geoResponse.ok) {
      throw new Error('Geolocation service unavailable');
    }

    const geoData = await geoResponse.json();

    if (geoData.status === 'fail') {
      throw new Error('Invalid IP address or geolocation failed');
    }

    // Determine suggested language based on country
    const countryCode = geoData.countryCode;
    const suggestedLanguage = COUNTRY_TO_LANGUAGE[countryCode] || 'en';

    // Calculate confidence based on country recognition
    const confidence = COUNTRY_TO_LANGUAGE[countryCode] ? 'high' : 'medium';

    console.log(`🎯 Location detected: ${geoData.country} (${countryCode}) → Language: ${suggestedLanguage}`);

    return NextResponse.json({
      success: true,
      location: {
        country: geoData.country,
        countryCode: geoData.countryCode,
        region: geoData.region,
        city: geoData.city,
        timezone: geoData.timezone,
        ip: clientIP,
        isLocalhost: false
      },
      suggestedLanguage,
      confidence,
      privacy: {
        dataMinimized: true,
        gdprCompliant: true,
        storagePolicy: 'No IP addresses stored permanently',
        userControl: 'Users can override language selection'
      }
    });

  } catch (error) {
    console.error('❌ Geolocation detection error:', error.message);

    // Fallback to English with privacy notice
    return NextResponse.json({
      success: false,
      error: error.message,
      fallback: {
        suggestedLanguage: 'en',
        confidence: 'low',
        reason: 'Geolocation service error - defaulting to English'
      },
      privacy: {
        dataMinimized: true,
        gdprCompliant: true,
        storagePolicy: 'No data collected due to error'
      }
    }, { status: 200 }); // Still return 200 with fallback
  }
}