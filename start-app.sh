#!/bin/bash

# Sleep Tracker App Startup Script
echo "🛌 Starting Sleep Tracker App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}❌ npm not found. Please install npm${NC}"
    exit 1
fi

# Check if server dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing server dependencies...${NC}"
    cd server && npm install && cd ..
fi

# Check if client dependencies are installed
if [ ! -d "client/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

# Check if ports are available
if port_in_use 5001; then
    echo -e "${YELLOW}⚠️  Port 5001 is already in use. The server might already be running.${NC}"
fi

if port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use. The client might already be running.${NC}"
fi

# Start the server
echo -e "${BLUE}🚀 Starting server on port 5001...${NC}"
cd server
npm start &
SERVER_PID=$!
cd ..

# Wait a moment for server to start
sleep 3

# Check if server started successfully
if port_in_use 5001; then
    echo -e "${GREEN}✅ Server started successfully on http://localhost:5001${NC}"
else
    echo -e "${RED}❌ Server failed to start${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start the client
echo -e "${BLUE}🎨 Starting client on port 3000...${NC}"
cd client
npm start &
CLIENT_PID=$!
cd ..

# Wait for client to start
sleep 5

if port_in_use 3000; then
    echo -e "${GREEN}✅ Client started successfully on http://localhost:3000${NC}"
    echo ""
    echo -e "${GREEN}🎉 Sleep Tracker is now running!${NC}"
    echo -e "${BLUE}📱 Open your browser and go to: http://localhost:3000${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tips:${NC}"
    echo -e "   • Create an account or login to start tracking your sleep"
    echo -e "   • Set your sleep goals in the dashboard"
    echo -e "   • Use the Quick Sleep Log for easy bedtime tracking"
    echo -e "   • Enable notifications for sleep reminders"
    echo ""
    echo -e "${YELLOW}🛑 To stop the app:${NC}"
    echo -e "   • Press Ctrl+C in this terminal"
    echo -e "   • Or run: kill $SERVER_PID $CLIENT_PID"
else
    echo -e "${RED}❌ Client failed to start${NC}"
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 1
fi

# Keep the script running
wait