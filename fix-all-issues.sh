#!/bin/bash

echo "🔧 Comprehensive Sleep Tracker Fix Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Step 1: Cleaning up build artifacts...${NC}"

# Stop any running processes
echo "🛑 Stopping any running processes..."
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Clean client build artifacts
echo "🧹 Cleaning client build artifacts..."
cd client
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf build 2>/dev/null || true
rm -rf .eslintcache 2>/dev/null || true
npm cache clean --force 2>/dev/null || true

# Clean server artifacts
echo "🧹 Cleaning server artifacts..."
cd ../server
rm -rf node_modules/.cache 2>/dev/null || true

cd ..

echo -e "${BLUE}🔍 Step 2: Checking for syntax errors...${NC}"

# Check for any remaining calculateSleepStreak references
echo "🔍 Checking for calculateSleepStreak references..."
if grep -r "calculateSleepStreak" client/src/ --exclude-dir=node_modules 2>/dev/null; then
    echo -e "${RED}❌ Found calculateSleepStreak references!${NC}"
else
    echo -e "${GREEN}✅ No calculateSleepStreak references found${NC}"
fi

echo -e "${BLUE}🔧 Step 3: Installing dependencies...${NC}"

# Reinstall client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

# Reinstall server dependencies  
echo "📦 Installing server dependencies..."
cd ../server
npm install

cd ..

echo -e "${BLUE}🚀 Step 4: Starting services...${NC}"

# Start server in background
echo "🖥️  Starting server..."
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Server is running on port 5001${NC}"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start client
echo "🎨 Starting client..."
cd client
npm start &
CLIENT_PID=$!
cd ..

# Wait for client to start
sleep 5

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Check browser console for any errors"
echo "3. Try creating a new account"
echo "4. Add a sleep entry to test functionality"
echo ""
echo -e "${YELLOW}🛑 To stop services:${NC}"
echo "Press Ctrl+C or run: kill $SERVER_PID $CLIENT_PID"
echo ""
echo -e "${BLUE}📊 Monitor performance with Ctrl+Shift+P in the app${NC}"

# Keep script running
wait