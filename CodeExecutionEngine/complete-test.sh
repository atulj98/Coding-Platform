#!/bin/bash

BASE_URL="http://localhost:9000/api"

echo "🚀 Complete API Testing Workflow..."
echo "=================================="

# Step 1: Register user
echo "📝 Step 1: Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo "📋 Registration Response:"
echo $REGISTER_RESPONSE | jq '.'

TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "✅ Token extracted: ${TOKEN:0:30}..."
echo ""

# Step 2: Submit code
echo "💻 Step 2: Submitting Python code..."
SUBMIT_RESPONSE=$(curl -s -X POST $BASE_URL/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "60f7b3b3b3b3b3b3b3b3b3b1",
    "language": "python",
    "code": "print(\"Hello from automated test!\")\nprint(\"Current time:\", \"2023-12-07\")"
  }')

echo "📋 Submit Response:"
echo $SUBMIT_RESPONSE | jq '.'

SUBMISSION_ID=$(echo $SUBMIT_RESPONSE | jq -r '.data.submissionId // .data._id')
echo "✅ Submission ID: $SUBMISSION_ID"
echo ""

# Step 3: Check submission status immediately
echo "🔍 Step 3: Checking submission status (immediate)..."
STATUS_RESPONSE=$(curl -s -X GET $BASE_URL/code/submission/$SUBMISSION_ID \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Status Response (immediate):"
echo $STATUS_RESPONSE | jq '.'
echo ""

# Step 4: Wait and check again
echo "⏳ Step 4: Waiting 5 seconds for execution..."
sleep 5

STATUS_RESPONSE_2=$(curl -s -X GET $BASE_URL/code/submission/$SUBMISSION_ID \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Status Response (after wait):"
echo $STATUS_RESPONSE_2 | jq '.'
echo ""

# Step 5: Get detailed results
echo "📊 Step 5: Getting detailed results..."
RESULTS_RESPONSE=$(curl -s -X GET $BASE_URL/code/submission/$SUBMISSION_ID/results \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Detailed Results Response:"
echo $RESULTS_RESPONSE | jq '.'
echo ""

# Step 6: Get user's submissions list
echo "📜 Step 6: Getting user's submissions..."
SUBMISSIONS_RESPONSE=$(curl -s -X GET $BASE_URL/code/submissions \
  -H "Authorization: Bearer $TOKEN")

echo "📋 Submissions List Response:"
echo $SUBMISSIONS_RESPONSE | jq '.'
echo ""

# Step 7: Get supported languages
echo "🔧 Step 7: Getting supported languages..."
LANGUAGES_RESPONSE=$(curl -s -X GET $BASE_URL/code/languages)

echo "📋 Languages Response:"
echo $LANGUAGES_RESPONSE | jq '.'
echo ""

# Step 8: Get code template
echo "📝 Step 8: Getting Python template..."
TEMPLATE_RESPONSE=$(curl -s -X GET $BASE_URL/code/template/python)

echo "📋 Template Response:"
echo $TEMPLATE_RESPONSE | jq '.'
echo ""

# Step 9: Health check
echo "❤️ Step 9: Health check..."
HEALTH_RESPONSE=$(curl -s -X GET http://localhost:9000/health)

echo "📋 Health Response:"
echo $HEALTH_RESPONSE | jq '.'

echo ""
echo "🎉 Complete API workflow demonstration finished!"
echo "=========================================="
