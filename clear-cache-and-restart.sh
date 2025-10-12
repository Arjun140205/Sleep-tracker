#!/bin/bash

echo "🧹 NUCLEAR CACHE CLEARING - FIXING PERSISTENT ERRORS"
echo "===================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${RED}🛑 Step 1: Killing all processes...${NC}"
pkill -f "react-scripts" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true
pkill -f "webpack" 2>/dev/null || true
sleep 3

echo -e "${YELLOW}🧹 Step 2: Nuclear cache clearing...${NC}"

# Client cache clearing
cd client
echo "🗑️  Removing client caches..."
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf build 2>/dev/null || true
rm -rf .eslintcache 2>/dev/null || true
rm -rf public/static 2>/dev/null || true

# Clear npm cache
npm cache clean --force 2>/dev/null || true

# Clear yarn cache if exists
yarn cache clean 2>/dev/null || true

# Server cache clearing
cd ../server
echo "🗑️  Removing server caches..."
rm -rf node_modules/.cache 2>/dev/null || true

cd ..

echo -e "${BLUE}🔄 Step 3: Reinstalling dependencies...${NC}"

# Reinstall client dependencies
cd client
echo "📦 Reinstalling client dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install

# Reinstall server dependencies
cd ../server
echo "📦 Reinstalling server dependencies..."
rm -rf node_modules package-lock.json 2>/dev/null || true
npm install

cd ..

echo -e "${GREEN}✅ Step 4: Cache clearing complete!${NC}"
echo ""
echo -e "${YELLOW}🚀 Now starting fresh services...${NC}"

# Start server
echo "🖥️  Starting server..."
cd server
npm start &
SERVER_PID=$!
cd ..

sleep 3

# Start client
echo "🎨 Starting client..."
cd client
npm start &
CLIENT_PID=$!
cd ..

echo ""
echo -e "${GREEN}🎉 Fresh start complete!${NC}"
echo ""
echo -e "${BLUE}📋 What was cleared:${NC}"
echo "  ✅ All React build caches"
echo "  ✅ All npm caches"
echo "  ✅ All webpack caches"
echo "  ✅ All ESLint caches"
echo "  ✅ Old SleepInsights component (deleted)"
echo "  ✅ Fresh node_modules installed"
echo ""
echo -e "${YELLOW}🔍 Check for errors:${NC}"
echo "  • Open http://localhost:3000"
echo "  • Check browser console (F12)"
echo "  • Look for any remaining calculateSleepStreak errors"
echo ""
echo -e "${RED}🛑 To stop: kill $SERVER_PID $CLIENT_PID${NC}"

wait