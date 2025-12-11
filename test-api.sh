#!/bin/bash
# Test API endpoints

API_BASE="http://localhost:3001/api"

echo "Testing Stream Workflow Status API"
echo "===================================="
echo ""

# Wait for server to start
sleep 2

echo "1. Testing GET /api/stats"
echo "-------------------------"
curl -s "${API_BASE}/stats" | jq '.'
echo ""

echo "2. Testing GET /api/streams"
echo "-------------------------"
curl -s "${API_BASE}/streams" | jq '.streams | length'
echo ""

echo "3. Testing GET /api/streams?status=active"
echo "----------------------------------------"
curl -s "${API_BASE}/streams?status=active" | jq '.'
echo ""

echo "4. Testing GET /api/commits?limit=5"
echo "----------------------------------"
curl -s "${API_BASE}/commits?limit=5" | jq '.'
echo ""

echo "API tests completed!"
