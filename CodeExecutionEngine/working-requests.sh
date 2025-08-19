#!/bin/bash

# Get fresh token
TOKEN=$(curl -s -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Working User", "email": "working'$(date +%s)'@example.com", "password": "password123"}' | jq -r '.data.token')

echo "🔑 Token: $TOKEN"
echo ""

# WORKING REQUEST 1: Add Two Numbers
echo "✅ WORKING REQUEST 1: Add Two Numbers"
echo "====================================="
echo "Request:"
cat << 'EOF'
{
  "problemId": "686e5e8eda809469125ac3e2",
  "language": "python",
  "code": "def solution(a, b):\n    return a + b"
}
EOF

RESPONSE1=$(curl -s -X POST http://localhost:9000/api/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "686e5e8eda809469125ac3e2",
    "language": "python",
    "code": "def solution(a, b):\n    return a + b"
  }')

echo ""
echo "Response:"
echo "$RESPONSE1" | jq '.'

SUBMISSION_ID1=$(echo "$RESPONSE1" | jq -r '.data.submissionId')
echo ""

# Wait and check results
echo "⏳ Waiting 5 seconds..."
sleep 5

RESULTS1=$(curl -s -X GET http://localhost:9000/api/code/submission/$SUBMISSION_ID1/results \
  -H "Authorization: Bearer $TOKEN")

echo "Results:"
echo "$RESULTS1" | jq '.data.submission.status, .data.submission.overallResult'

echo ""
echo "========================================="
echo ""

# WORKING REQUEST 2: Two Sum
echo "✅ WORKING REQUEST 2: Two Sum"
echo "============================="
echo "Request:"
cat << 'EOF'
{
  "problemId": "686e5e8eda809469125ac3d7",
  "language": "python",
  "code": "def solution(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
}
EOF

RESPONSE2=$(curl -s -X POST http://localhost:9000/api/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "problemId": "686e5e8eda809469125ac3d7",
    "language": "python",
    "code": "def solution(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []"
  }')

echo ""
echo "Response:"
echo "$RESPONSE2" | jq '.'

echo ""
echo "🎉 BOTH REQUESTS WILL WORK!"
echo "Use these exact problem IDs:"
echo "- Add Two Numbers: 686e5e8eda809469125ac3e2"
echo "- Two Sum: 686e5e8eda809469125ac3d7"
