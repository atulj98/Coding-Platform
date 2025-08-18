# 🚀 Production Code Execution Engine - Complete Setup Guide

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Architecture Details](#architecture-details)
5. [API Documentation](#api-documentation)
6. [Testing Guide](#testing-guide)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 🏗️ System Overview

This is a **production-grade code execution engine** built with the MERN stack that provides:

- **Secure Code Execution**: Docker-based sandboxing with resource limits
- **Multi-Language Support**: Python, Java, C++, JavaScript, C
- **Real-time Processing**: Queue-based execution with Redis
- **Security First**: Comprehensive input validation and malicious code detection
- **Performance Monitoring**: Prometheus metrics and structured logging
- **Scalable Architecture**: Microservices-ready design

## 🔧 Prerequisites

### Required Software
```bash
# Node.js 16+ and npm
node --version  # Should be 16.0.0 or higher
npm --version

# Docker and Docker Compose
docker --version
docker-compose --version

# MongoDB (local or cloud)
mongosh --version  # or mongo --version

# Redis (local or cloud) 
redis-cli --version
```

### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 10GB free space for Docker images
- **OS**: Linux, macOS, or Windows with WSL2

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd codingPlatformBackend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file:
```bash
# Required Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeplatform
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional Configuration  
LOG_LEVEL=info
MAX_CODE_LENGTH=50000
MAX_EXECUTION_TIME=30000
```

### 3. Start Dependencies

#### Option A: Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

#### Option B: Manual Setup
```bash
# Start MongoDB
mongod --dbpath /path/to/your/db

# Start Redis
redis-server

# In separate terminals
```

### 4. Build Docker Images
```bash
# Build all execution environment images
npm run docker:build-all

# Or build individually
docker build -f docker/Dockerfile.python -t codeexec-python .
docker build -f docker/Dockerfile.java -t codeexec-java .
docker build -f docker/Dockerfile.cpp -t codeexec-cpp .
docker build -f docker/Dockerfile.javascript -t codeexec-javascript .
docker build -f docker/Dockerfile.c -t codeexec-c .
```

### 5. Start the Application
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Verify Installation
```bash
# Run the test suite
chmod +x test-setup.sh
./test-setup.sh

# Or test manually
curl http://localhost:5000/health
```

## 🏛️ Architecture Details

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Express API   │    │   Docker Engine │
│   (React)       │────│   Server        │────│   (Execution)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                       ┌───────┼───────┐
                       │               │
                ┌─────────────┐ ┌─────────────┐
                │  MongoDB    │ │    Redis    │
                │ (Data)      │ │  (Queue)    │
                └─────────────┘ └─────────────┘
```

### Service Architecture

#### 1. **API Layer** (`app.js`)
- Express.js server with security middleware
- Rate limiting and request validation
- Health checks and metrics endpoints

#### 2. **Authentication** (`routes/auth.js`)
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt

#### 3. **Code Execution** (`routes/codeExecution.js`)
- Code submission endpoints
- Result retrieval
- Language support queries

#### 4. **Core Services**

##### **DockerManager** (`services/DockerManager.js`)
- Container lifecycle management
- Resource limit enforcement
- Secure execution environment

##### **CodeExecutor** (`services/CodeExecutor.js`)
- Execution queue management
- Test case processing
- Result compilation

##### **SecurityValidator** (`services/SecurityValidator.js`)
- Malicious code detection
- Input sanitization
- Pattern-based security scanning

##### **ComplexityAnalyzer** (`services/ComplexityAnalyzer.js`)
- Time/space complexity analysis
- Performance metrics
- Code quality assessment

#### 5. **Data Models**
- **CodeSubmission**: Tracks all code submissions
- **ExecutionResult**: Detailed execution metrics
- **TestCase**: Problem test cases
- **User**: User management
- **Problem**: Problem definitions

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Code Execution Endpoints

#### Submit Code
```bash
POST /api/code/submit
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "problemId": "507f1f77bcf86cd799439011",
  "code": "print('Hello World')",
  "language": "python"
}

# Response
{
  "success": true,
  "data": {
    "submissionId": "507f191e810c19729de860ea",
    "status": "queued"
  }
}
```

#### Get Submission Status
```bash
GET /api/code/submission/507f191e810c19729de860ea
Authorization: Bearer <jwt-token>

# Response
{
  "success": true,
  "data": {
    "status": "accepted",
    "overallResult": {
      "totalTests": 3,
      "passedTests": 3,
      "verdict": "accepted"
    }
  }
}
```

#### Get Detailed Results
```bash
GET /api/code/submission/507f191e810c19729de860ea/results
Authorization: Bearer <jwt-token>

# Response includes execution details, test case results, complexity analysis
```

#### Get User Submissions
```bash
GET /api/code/submissions?page=1&limit=20&status=accepted
Authorization: Bearer <jwt-token>
```

#### Get Supported Languages
```bash
GET /api/code/languages

# Response
{
  "success": true,
  "data": {
    "python": {
      "name": "Python",
      "version": "3.11",
      "fileExtension": ".py"
    }
  }
}
```

### System Endpoints

#### Health Check
```bash
GET /health

# Response
{
  "status": "OK",
  "timestamp": "2025-07-09T10:30:00.000Z",
  "uptime": 1234.567
}
```

#### Metrics (Prometheus)
```bash
GET /metrics
```

## 🧪 Testing Guide

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- tests/unit/codeExecutor.test.js
```

### Manual Testing

#### 1. Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

#### 2. Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 3. Test Code Submission
```bash
# Get token from login response
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:5000/api/code/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "problemId": "507f1f77bcf86cd799439011",
    "code": "print(\"Hello World\")",
    "language": "python"
  }'
```

### Load Testing

```bash
# Install artillery for load testing
npm install -g artillery

# Create load test script
cat > load-test.yml << EOF
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Submit code"
    requests:
      - post:
          url: "/api/code/submit"
          headers:
            Authorization: "Bearer YOUR_TOKEN"
            Content-Type: "application/json"
          json:
            problemId: "507f1f77bcf86cd799439011"
            code: "print('Hello')"
            language: "python"
EOF

# Run load test
artillery run load-test.yml
```

## 🚀 Deployment

### Production Docker Deployment

#### 1. Update Environment
```bash
# Create production .env
cp .env.example .env.production

# Edit for production
NODE_ENV=production
MONGODB_URI=mongodb://your-production-mongo:27017/codeplatform
REDIS_URL=redis://your-production-redis:6379
JWT_SECRET=your-super-secure-production-secret
```

#### 2. Deploy with Docker Compose
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

#### 3. Scale Services
```bash
# Scale the application
docker-compose up -d --scale app=3

# Scale with load balancer
# (Requires nginx configuration)
```

### Cloud Deployment Options

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-west-2.amazonaws.com

docker build -t code-execution-engine .
docker tag code-execution-engine:latest your-account.dkr.ecr.us-west-2.amazonaws.com/code-execution-engine:latest
docker push your-account.dkr.ecr.us-west-2.amazonaws.com/code-execution-engine:latest
```

#### Kubernetes
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: code-execution-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: code-execution-engine
  template:
    metadata:
      labels:
        app: code-execution-engine
    spec:
      containers:
      - name: app
        image: your-registry/code-execution-engine:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: mongodb-uri
```

## 🔍 Monitoring & Observability

### Metrics
Access Prometheus metrics at `http://localhost:5000/metrics`

Key metrics:
- `code_executions_total` - Total executions by language/status
- `code_execution_duration_seconds` - Execution time histogram
- `execution_queue_size` - Current queue size

### Logging
Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

Log format:
```json
{
  "timestamp": "2025-07-09T10:30:00.000Z",
  "level": "info",
  "message": "Code execution completed",
  "submissionId": "507f191e810c19729de860ea",
  "language": "python",
  "verdict": "accepted"
}
```

### Health Monitoring
```bash
# Set up health check monitoring
while true; do
  curl -f http://localhost:5000/health || echo "Health check failed"
  sleep 30
done
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Docker Permission Errors
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Restart Docker daemon
sudo systemctl restart docker
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongosh --eval "db.runCommand('ping')"

# Restart MongoDB
sudo systemctl restart mongod
```

#### 3. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Restart Redis
sudo systemctl restart redis-server
```

#### 4. Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

#### 5. Docker Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild with no cache
docker build --no-cache -f docker/Dockerfile.python -t codeexec-python .
```

### Performance Issues

#### High Memory Usage
```bash
# Monitor container memory
docker stats

# Limit container memory
docker run --memory=512m codeexec-python

# Check Node.js memory
node --max-old-space-size=4096 app.js
```

#### Slow Execution
```bash
# Check queue status
redis-cli llen execution_queue

# Monitor execution times
tail -f logs/combined.log | grep "execution_time"

# Scale workers
docker-compose up -d --scale app=3
```

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Debug specific service
DEBUG=DockerManager npm run dev

# Enable Node.js debugging
node --inspect app.js
```

## 📚 Additional Resources

### Development Tools
- **Postman Collection**: Import API endpoints for testing
- **VS Code Extensions**: Docker, MongoDB, Redis extensions
- **Git Hooks**: Pre-commit linting and testing

### Security Best Practices
- Never expose Docker socket in production
- Use secrets management for production credentials
- Implement rate limiting per user
- Regular security audits with `npm audit`
- Monitor for suspicious code patterns

### Performance Optimization
- Use Redis clustering for high throughput
- Implement connection pooling for MongoDB
- Container resource limits based on usage patterns
- CDN for static assets
- Database indexing optimization

---

## 🎉 Success!

Your production-grade code execution engine is now ready! 

For support:
- Check the logs: `tail -f logs/combined.log`
- Run health check: `curl http://localhost:5000/health`
- Monitor metrics: `curl http://localhost:5000/metrics`

Happy coding! 🚀
