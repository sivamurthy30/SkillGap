#!/bin/bash

echo "🧹 Clearing React cache and rebuilding..."

# Navigate to project directory
cd "$(dirname "$0")"

# Remove node_modules cache
echo "📦 Clearing node_modules cache..."
rm -rf node_modules/.cache

# Remove build directory
echo "🗑️  Removing build directory..."
rm -rf build

# Clear npm cache
echo "🔄 Clearing npm cache..."
npm cache clean --force

echo "✅ Cache cleared!"
echo ""
echo "Now restart your development server:"
echo "  npm start"
echo ""
echo "Or if it's already running, stop it (Ctrl+C) and run:"
echo "  npm start"
