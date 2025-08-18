#!/bin/bash

BASE_URL="http://localhost:9000/api"

echo "🚀 Testing Code Execution API..."

# Step 1: Register user
echo "📝 Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "✅ User registered. Token: ${TOKEN:0:20}..."

# Step 2: Submit code
echo "💻 Submitting Python code..."
SUBMIT_RESPONSE=$(curl -s -X POST $BASE_URL/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "60f7b3b3b3b3b3b3b3b3b3b1",
    "language": "python",
    "code": "print(\"Hello from automated test!\")\nprint(\"Current time:\", \"2023-12-07\")"
  }')

SUBMISSION_ID=$(echo $SUBMIT_RESPONSE | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Code submitted. Submission ID: $SUBMISSION_ID"

# Step 3: Check status
echo "🔍 Checking submission status..."
sleep 3  # Wait for execution
STATUS_RESPONSE=$(curl -s -X GET $BASE_URL/code/submission/$SUBMISSION_ID \
  -H "Authorization: Bearer $TOKEN")

echo "📊 Final Result:"
echo $STATUS_RESPONSE | jq '.'