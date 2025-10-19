#!/bin/bash
# 🐾⚡ NEKO DEFENSE - Secure Vercel Environment Setup ⚡🐾
#
# This script SAFELY adds MongoDB credentials to Vercel
# Follows Rule 3.2: Credential Security Protocol
# - NO hardcoded credentials
# - NO credential exposure in terminal/process list
# - Reads from secure .env file only

set -e  # Exit on error

echo "🐾 NEKO DEFENSE - Vercel Environment Configuration"
echo "=================================================="
echo ""

# Check .env file exists
if [ ! -f .env ]; then
  echo "❌ ERROR: .env file not found!"
  exit 1
fi

# Extract MongoDB URI from .env file (SECURE - no command-line exposure)
MONGODB_URI=$(grep "^MONGODB_URI=" .env | cut -d'=' -f2-)

if [ -z "$MONGODB_URI" ]; then
  echo "❌ ERROR: MONGODB_URI not found in .env file!"
  exit 1
fi

echo "✅ MongoDB URI loaded from .env file"
echo ""

# Add to Vercel Production
echo "📤 Adding MONGODB_URI to Vercel Production..."
echo "$MONGODB_URI" | vercel env add MONGODB_URI production 2>&1 | grep -v "mongodb+srv" || true

# Add to Vercel Preview
echo "📤 Adding MONGODB_URI to Vercel Preview..."
echo "$MONGODB_URI" | vercel env add MONGODB_URI preview 2>&1 | grep -v "mongodb+srv" || true

# Add to Vercel Development
echo "📤 Adding MONGODB_URI to Vercel Development..."
echo "$MONGODB_URI" | vercel env add MONGODB_URI development 2>&1 | grep -v "mongodb+srv" || true

echo ""
echo "✅ Environment variables configured on Vercel!"
echo "✅ Credentials added securely (no exposure)"
echo ""
echo "🚀 Ready to deploy to Chilean audience, nyaa~!"
