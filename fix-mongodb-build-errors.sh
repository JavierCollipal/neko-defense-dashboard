#!/bin/bash

# Fix MongoDB Build Errors Script
# Adds 'export const dynamic = force-dynamic' to all MongoDB API routes
# This prevents static generation during build when MONGODB_URI is not available

echo "🔧 Fixing MongoDB API Routes for Build Compatibility..."
echo ""

# List of routes to fix
routes=(
  "app/api/ready-operations/route.js"
  "app/api/honeypots/route.js"
  "app/api/valech/stats/route.js"
  "app/api/dina/stats/route.js"
  "app/api/dina/perpetrators/route.js"
  "app/api/threat-counts/route.js"
  "app/api/threat-actors/route.js"
  "app/api/personality-workflow/route.ts"
  "app/api/deceased-officers/route.js"
  "app/api/dina-agents/route.js"
  "app/api/evidence-packages/route.js"
  "app/api/hunt-conversations/route.js"
  "app/api/dina-brigades/route.js"
  "app/api/case-patterns/route.js"
  "app/api/fallen-officers/route.js"
  "app/api/family-members/route.js"
  "app/api/confessions/submit/route.js"
  "app/api/confessions/route.js"
  "app/api/valech/victims/route.ts"
)

fixed=0
skipped=0

for route in "${routes[@]}"; do
  if [ ! -f "$route" ]; then
    echo "⚠️  SKIP: $route (file not found)"
    skipped=$((skipped + 1))
    continue
  fi

  # Check if already has dynamic export
  if grep -q "export const dynamic" "$route"; then
    echo "✅ SKIP: $route (already has dynamic export)"
    skipped=$((skipped + 1))
    continue
  fi

  # Add dynamic export after imports
  # Find first export function line
  if grep -q "export async function GET" "$route"; then
    # Insert before first export function
    sed -i '/export async function GET/i\
// Force dynamic rendering (prevents build errors when MONGODB_URI not set)\
export const dynamic = '\''force-dynamic'\'';\
' "$route"
    echo "✅ FIXED: $route (added dynamic export)"
    fixed=$((fixed + 1))
  elif grep -q "export async function POST" "$route"; then
    # Insert before first POST function
    sed -i '/export async function POST/i\
// Force dynamic rendering (prevents build errors when MONGODB_URI not set)\
export const dynamic = '\''force-dynamic'\'';\
' "$route"
    echo "✅ FIXED: $route (added dynamic export)"
    fixed=$((fixed + 1))
  else
    echo "⚠️  SKIP: $route (no export function found)"
    skipped=$((skipped + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Routes Fixed: $fixed"
echo "⚠️  Routes Skipped: $skipped"
echo "📝 Total Routes: ${#routes[@]}"
echo ""
echo "🎉 All MongoDB routes now skip static generation during build!"
echo "This allows builds to succeed even without MONGODB_URI configured."
echo ""
