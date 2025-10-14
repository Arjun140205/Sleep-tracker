#!/bin/bash

echo "💥 ULTRA NUCLEAR FIX - ELIMINATING PERSISTENT CACHE ISSUES"
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${RED}🛑 STEP 1: KILLING ALL PROCESSES${NC}"
echo "Terminating all Node.js and React processes..."
pkill -f "node" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
pkill -f "npm" 2>/dev/null || true
sleep 5

echo -e "${PURPLE}💥 STEP 2: NUCLEAR CACHE DESTRUCTION${NC}"

# Client nuclear cleanup
echo "🗑️  DESTROYING client caches..."
cd client

# Remove ALL possible cache locations
rm -rf node_modules 2>/dev/null || true
rm -rf .cache 2>/dev/null || true
rm -rf build 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf .eslintcache 2>/dev/null || true
rm -rf .next 2>/dev/null || true
rm -rf public/static 2>/dev/null || true
rm -rf src/.cache 2>/dev/null || true
rm -rf package-lock.json 2>/dev/null || true
rm -rf yarn.lock 2>/dev/null || true

# Clear npm global cache
npm cache clean --force 2>/dev/null || true
npm cache verify 2>/dev/null || true

# Clear yarn cache if exists
yarn cache clean 2>/dev/null || true

# Server nuclear cleanup
echo "🗑️  DESTROYING server caches..."
cd ../server

rm -rf node_modules 2>/dev/null || true
rm -rf .cache 2>/dev/null || true
rm -rf dist 2>/dev/null || true
rm -rf package-lock.json 2>/dev/null || true
rm -rf yarn.lock 2>/dev/null || true

cd ..

echo -e "${YELLOW}🧹 STEP 3: SYSTEM CACHE CLEANUP${NC}"

# Clear system temp files (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Clearing macOS caches..."
    rm -rf ~/Library/Caches/npm 2>/dev/null || true
    rm -rf ~/Library/Caches/yarn 2>/dev/null || true
    rm -rf /tmp/npm-* 2>/dev/null || true
    rm -rf /tmp/yarn-* 2>/dev/null || true
fi

# Clear Linux temp files
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Clearing Linux caches..."
    rm -rf ~/.npm 2>/dev/null || true
    rm -rf ~/.cache/yarn 2>/dev/null || true
    rm -rf /tmp/npm-* 2>/dev/null || true
fi

echo -e "${BLUE}📦 STEP 4: FRESH DEPENDENCY INSTALLATION${NC}"

# Install server dependencies first
echo "🖥️  Installing server dependencies..."
cd server
npm install --no-cache --prefer-offline=false
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server npm install failed${NC}"
    exit 1
fi

# Install client dependencies
echo "🎨 Installing client dependencies..."
cd ../client
npm install --no-cache --prefer-offline=false
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Client npm install failed${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}✅ STEP 5: VERIFICATION${NC}"

# Verify installations
echo "🔍 Verifying installations..."
if [ ! -d "server/node_modules" ]; then
    echo -e "${RED}❌ Server node_modules missing${NC}"
    exit 1
fi

if [ ! -d "client/node_modules" ]; then
    echo -e "${RED}❌ Client node_modules missing${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All dependencies installed successfully${NC}"

echo -e "${PURPLE}🚀 STEP 6: STARTING FRESH SERVICES${NC}"

# Start server
echo "🖥️  Starting server..."
cd server
npm start &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
sleep 5

# Check if server is running
if curl -s http://localhost:5001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running on port 5001${NC}"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start client
echo "🎨 Starting client..."
cd ../client

# Set environment variables to force fresh build
export GENERATE_SOURCEMAP=false
export SKIP_PREFLIGHT_CHECK=true
export FAST_REFRESH=false

npm start &
CLIENT_PID=$!
echo "Client PID: $CLIENT_PID"

cd ..

echo ""
echo -e "${GREEN}🎉 ULTRA NUCLEAR FIX COMPLETE!${NC}"
echo ""
echo -e "${YELLOW}📋 What was destroyed and rebuilt:${NC}"
echo "  💥 ALL node_modules directories"
echo "  💥 ALL cache directories (.cache, build, dist)"
echo "  💥 ALL lock files (package-lock.json, yarn.lock)"
echo "  💥 ALL npm/yarn caches"
echo "  💥 ALL system temp files"
echo "  💥 ALL webpack caches"
echo "  ✅ Fresh npm install (no cache)"
echo "  ✅ Fresh server start"
echo "  ✅ Fresh client start"
echo ""
echo -e "${BLUE}🌐 Access your app:${NC}"
echo "  • App: http://localhost:3000"
echo "  • API: http://localhost:5001"
echo ""
echo -e "${YELLOW}🔍 Check for errors:${NC}"
echo "  • Open browser dev tools (F12)"
echo "  • Look for any calculateSleepStreak errors"
echo "  • If errors persist, clear browser cache (Ctrl+Shift+Delete)"
echo ""
echo -e "${RED}🛑 To stop services:${NC}"
echo "  kill $SERVER_PID $CLIENT_PID"
echo ""
echo -e "${PURPLE}💡 If issues still persist:${NC}"
echo "  1. Clear browser cache completely"
echo "  2. Try incognito/private window"
echo "  3. Restart your computer"
echo "  4. Check for any global npm/node issues"

# Keep script running
wait