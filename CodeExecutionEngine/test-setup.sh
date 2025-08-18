#!/bin/bash

echo "🚀 Code Execution Engine - Test Suite"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "\n${YELLOW}Testing: $test_name${NC}"
    
    if eval "$test_command"; then
        echo -e "${GREEN}✅ PASSED: $test_name${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED: $test_name${NC}"
        ((TESTS_FAILED++))
    fi
}

# Check if Node.js is installed
run_test "Node.js Installation" "node --version"

# Check if npm is installed
run_test "NPM Installation" "npm --version"

# Check if Docker is installed
run_test "Docker Installation" "docker --version"

# Check if MongoDB is running (optional)
echo -e "\n${YELLOW}Checking MongoDB connection...${NC}"
if command -v mongosh &> /dev/null; then
    run_test "MongoDB Connection" "mongosh --eval 'db.runCommand(\"ping\").ok' --quiet mongodb://localhost:27017/test"
elif command -v mongo &> /dev/null; then
    run_test "MongoDB Connection" "mongo --eval 'db.runCommand(\"ping\").ok' --quiet mongodb://localhost:27017/test"
else
    echo -e "${YELLOW}⚠️  MongoDB client not found, skipping connection test${NC}"
fi

# Check if Redis is running (optional)
echo -e "\n${YELLOW}Checking Redis connection...${NC}"
if command -v redis-cli &> /dev/null; then
    run_test "Redis Connection" "redis-cli ping | grep PONG"
else
    echo -e "${YELLOW}⚠️  Redis client not found, skipping connection test${NC}"
fi

# Install dependencies
run_test "NPM Dependencies Installation" "npm install"

# Run linting
run_test "Code Linting" "npm run lint"

# Run unit tests
run_test "Unit Tests" "npm test"

# Build Docker images
echo -e "\n${YELLOW}Building Docker images...${NC}"
run_test "Python Docker Image" "docker build -f docker/Dockerfile.python -t codeexec-python ."
run_test "Java Docker Image" "docker build -f docker/Dockerfile.java -t codeexec-java ."
run_test "C++ Docker Image" "docker build -f docker/Dockerfile.cpp -t codeexec-cpp ."
run_test "JavaScript Docker Image" "docker build -f docker/Dockerfile.javascript -t codeexec-javascript ."
run_test "C Docker Image" "docker build -f docker/Dockerfile.c -t codeexec-c ."

# Test Docker containers
echo -e "\n${YELLOW}Testing Docker containers...${NC}"
run_test "Python Container Test" "echo 'print(\"Hello World\")' > test.py && echo '' | docker run --rm -v \$(pwd):/app codeexec-python python3 test.py && rm test.py"

# Final results
echo -e "\n======================================"
echo -e "${GREEN}✅ Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed! Your setup is ready.${NC}"
    exit 0
else
    echo -e "\n${RED}⚠️  Some tests failed. Please check the output above.${NC}"
    exit 1
fi
