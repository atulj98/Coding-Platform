# Production-Grade Code Execution Engine - MERN Stack

A secure, scalable code execution engine built with Node.js, Express, MongoDB, and Docker. Supports multiple programming languages with built-in security, complexity analysis, and performance monitoring.

## 🚀 Features

- **Multi-language Support**: Python, Java, C++, JavaScript, C
- **Secure Execution**: Docker containerization with resource limits
- **Complexity Analysis**: Automatic time/space complexity detection
- **Queue Management**: Redis-based execution queue with priority support
- **Security Validation**: Code security scanning and malicious pattern detection
- **Performance Monitoring**: Comprehensive metrics and logging
- **Rate Limiting**: Configurable request rate limiting
- **RESTful API**: Complete API for code submission and result retrieval

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │────│   Express API   │────│   Docker Engine │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                       ┌───────┴───────┐
                       │               │
                ┌─────────────┐ ┌─────────────┐
                │  MongoDB    │ │    Redis    │
                │ (Data)      │ │  (Queue)    │
                └─────────────┘ └─────────────┘
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 16+
- Docker & Docker Compose
- MongoDB
- Redis

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd codingPlatformBackend
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services**:
   ```bash
   # Development
   npm run dev
   
   # Production with Docker
   docker-compose up -d
   ```

## 📝 API Documentation

### Submit Code
```bash
POST /api/code/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "problemId": "507f1f77bcf86cd799439011",
  "code": "print('Hello World')",
  "language": "python"
}
```

### Get Submission Status
```bash
GET /api/code/submission/:submissionId
Authorization: Bearer <token>
```

### Get Supported Languages
```bash
GET /api/code/languages
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/codeplatform` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | JWT signing secret | Required |

### Docker Configuration

Each supported language has its own Dockerfile with security configurations:
- Non-root user execution
- Resource limits (CPU, Memory)
- Network isolation
- Read-only filesystem
- Security policies

## 🔐 Security Features

- **Input Validation**: Comprehensive code validation
- **Sandbox Execution**: Docker containers with strict limits
- **Pattern Detection**: Malicious code pattern scanning
- **Resource Limits**: CPU, memory, and time constraints
- **Network Isolation**: No external network access during execution

## 📊 Monitoring

- **Health Checks**: `/health` endpoint
- **Metrics**: Prometheus-compatible metrics at `/metrics`
- **Logging**: Structured logging with Winston
- **Queue Monitoring**: Redis queue statistics

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🏗️ Project Structure

```
├── models/              # MongoDB schemas
├── services/            # Core business logic
├── routes/              # API routes
├── middleware/          # Express middleware
├── utils/               # Utility functions
├── docker/              # Docker configurations
├── templates/           # Code templates
├── tests/               # Test files
├── monitoring/          # Metrics and monitoring
└── logs/                # Log files
```

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Install dependencies: `npm install --production`
2. Build Docker images: `npm run docker:build-all`
3. Start services: `npm start`

## 📈 Performance

- **Execution Time**: Sub-second for simple programs
- **Throughput**: 1000+ executions per minute
- **Memory Usage**: Configurable limits per language
- **Queue Processing**: Concurrent execution with priority support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run tests: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Check the logs in `logs/` directory
- Monitor queue status via Redis CLI
- Use health check endpoint for service status
- Review Docker container logs for execution issues

## 🔮 Roadmap

- [ ] WebSocket support for real-time execution updates
- [ ] More language support (Go, Rust, Kotlin)
- [ ] Advanced complexity analysis with ML
- [ ] Distributed execution across multiple nodes
- [ ] GraphQL API support
- [ ] Advanced security scanning with static analysis
