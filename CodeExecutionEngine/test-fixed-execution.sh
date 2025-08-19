#!/bin/bash

echo "🔧 TESTING FIXED CODE EXECUTION"
echo "==============================="

# Get fresh token
echo "1. Getting fresh token..."
TOKEN=$(curl -s -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Fixed User", "email": "testfixed'$(date +%s)'@example.com", "password": "password123"}' | jq -r '.data.token')

echo "✅ Token obtained: ${TOKEN:0:30}..."

echo ""
echo "2. Submitting corrected solution..."
echo "Request Body:"
cat << 'EOF'
{
  "problemId": "686e5e8eda809469125ac3e2",
  "language": "python",
  "code": "def solution(a, b):\n    return a + b"
}
EOF

SUBMIT_RESPONSE=$(curl -s -X POST http://localhost:9000/api/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "686e5e8eda809469125ac3e2",
    "language": "python",
    "code": "def solution(a, b):\n    return a + b"
  }')

echo ""
echo "✅ Submission Response:"
echo "$SUBMIT_RESPONSE" | jq '.'

SUBMISSION_ID=$(echo "$SUBMIT_RESPONSE" | jq -r '.data.submissionId // .data._id')

if [ "$SUBMISSION_ID" != "null" ] && [ -n "$SUBMISSION_ID" ]; then
    echo ""
    echo "3. Waiting 10 seconds for execution..."
    sleep 10
    
    echo "4. Getting final results..."
    RESULTS=$(curl -s -X GET http://localhost:9000/api/code/submission/$SUBMISSION_ID/results \
      -H "Authorization: Bearer $TOKEN")
    
    echo "✅ Final Results:"
    echo "$RESULTS" | jq '.'
    
    echo ""
    echo "🎯 KEY METRICS:"
    echo "Status: $(echo "$RESULTS" | jq -r '.data.submission.status')"
    echo "Passed Tests: $(echo "$RESULTS" | jq -r '.data.submission.overallResult.passedTests')"
    echo "Total Tests: $(echo "$RESULTS" | jq -r '.data.submission.overallResult.totalTests')"
    echo "First Output: $(echo "$RESULTS" | jq -r '.data.submission.executionResults[0].actualOutput')"
    echo "Expected: $(echo "$RESULTS" | jq -r '.data.submission.executionResults[0].expectedOutput')"
else
    echo "❌ Failed to get submission ID"
fi

echo ""
echo "🎉 TEST COMPLETE!"
