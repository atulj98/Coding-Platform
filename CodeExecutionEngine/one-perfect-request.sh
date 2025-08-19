#!/bin/bash

# Perfect API Request Demo
BASE_URL="http://localhost:9000/api"

echo "🎯 PERFECT API REQUEST DEMO"
echo "=========================="

# Register
echo "1️⃣ Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Perfect User", "email": "perfect'$(date +%s)'@example.com", "password": "password123"}')

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "✅ Got token: ${TOKEN:0:20}..."

# Submit perfect request
echo ""
echo "2️⃣ Submitting PERFECT request..."
echo "Request Body:"
echo '{
  "problemId": "686e5e8eda809469125ac3e2",
  "language": "python", 
  "code": "def solution(a, b):\\n    return a + b"
}'

SUBMIT_RESPONSE=$(curl -s -X POST $BASE_URL/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "686e5e8eda809469125ac3e2",
    "language": "python",
    "code": "def solution(a, b):\n    return a + b"
  }')

echo ""
echo "✅ Submit Response:"
echo $SUBMIT_RESPONSE | jq '.'

SUBMISSION_ID=$(echo $SUBMIT_RESPONSE | jq -r '.data.submissionId')

echo ""
echo "3️⃣ Getting results after 5 seconds..."
sleep 5

RESULTS=$(curl -s -X GET $BASE_URL/code/submission/$SUBMISSION_ID/results \
  -H "Authorization: Bearer $TOKEN")

echo "✅ Final Results:"
echo $RESULTS | jq '.'

echo ""
echo "🎉 PERFECT REQUEST COMPLETE!"
echo "Use submission ID: $SUBMISSION_ID"
