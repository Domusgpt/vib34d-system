#!/bin/bash

echo "🤖 VIB34D Agent Integration Testing"
echo "=================================="

# Kill any existing servers
echo "🧹 Cleaning up existing processes..."
pkill -f "vite" 2>/dev/null || true
pkill -f "python -m http.server" 2>/dev/null || true
sleep 2

# Start the Vite server
echo "🚀 Starting VIB34D system server..."
cd /mnt/c/Users/millz/Desktop/629claude
npm run dev > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to fully start
echo "⏳ Waiting for server to initialize..."
sleep 8

# Check if server is responding
echo "🔍 Checking server status..."
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "✅ Server is running at http://localhost:3000"
else
    echo "❌ Server failed to start properly"
    echo "📋 Server log:"
    cat server.log
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Run the agent integration test
echo ""
echo "🤖 Starting Agent Integration Test..."
echo "======================================"
node agent-integration-test.js

# Capture the test exit code
TEST_EXIT_CODE=$?

# Display server info
echo ""
echo "🌐 VIB34D System is running at: http://localhost:3000"
echo "📋 Server log available in: server.log"
echo ""

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "🎉 AGENT INTEGRATION TEST PASSED!"
    echo "   The VIB34D system is ready for agent use!"
else
    echo "💥 AGENT INTEGRATION TEST FAILED!"
    echo "   System needs attention before agent deployment."
fi

echo ""
echo "🔍 Browser left open for manual inspection..."
echo "   Press Ctrl+C to stop the server when done."

# Keep server running for manual inspection
wait $SERVER_PID