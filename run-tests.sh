#!/bin/bash

echo "🚀 Starting VIB34D System Testing with Vite + Puppeteer"

# Kill any existing servers
pkill -f "vite" || true
pkill -f "python -m http.server" || true

# Start Vite development server in background
echo "📡 Starting Vite development server..."
npm run dev &
VITE_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Vite server is running on http://localhost:3000"
else
    echo "❌ Failed to start Vite server"
    kill $VITE_PID 2>/dev/null || true
    exit 1
fi

# Run Puppeteer tests
echo "🧪 Running automated tests..."
node test-vib34d-system.js

# Capture exit code
TEST_EXIT_CODE=$?

# Clean up
echo "🧹 Cleaning up..."
kill $VITE_PID 2>/dev/null || true

# Exit with test result
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests completed successfully!"
else
    echo "❌ Tests failed with exit code $TEST_EXIT_CODE"
fi

exit $TEST_EXIT_CODE