# Architecture Documentation

This document describes the system architecture, design patterns, and technical decisions for the Coding Platform Backend.

## System Overview

The Coding Platform Backend is a RESTful API service built with Node.js and Express.js, designed to support a competitive programming platform with features like user management, problem solving, code submission, and real-time communication.

## Architecture Pattern

The application follows a **Layered Architecture** pattern with clear separation of concerns:

```
┌─────────────────────┐
│   Presentation      │  ← Routes, Controllers, Middleware
├─────────────────────┤
│   Business Logic    │  ← Services, Validators, Utils
├─────────────────────┤
│   Data Access       │  ← Models, Database Layer
├─────────────────────┤
│   Infrastructure    │  ← Database, File System, External APIs
└─────────────────────┘
```

## Component Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Web App, Mobile App, Admin Dashboard)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────▼───────────────────────────────────────┐
│                   API Gateway                               │
│  (Rate Limiting, Authentication, Request Validation)        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Application Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Auth      │ │  Problems   │ │ Submissions │           │
│  │  Service    │ │   Service   │ │   Service   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    User     │ │    File     │ │  WebSocket  │           │
│  │   Service   │ │   Service   │ │   Service   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Data Layer                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  MongoDB    │ │ File System │ │   Redis     │           │
│  │ (Primary)   │ │ (Uploads)   │ │ (Cache)     │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
codingPlatformBackend/
├── controllers/         # HTTP request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── problemController.js
│   └── submissionController.js
├── models/             # Data models and schemas
│   ├── User.js
│   ├── Problem.js
│   ├── Submission.js
│   └── File.js
├── routes/             # API route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── problemRoutes.js
│   └── submissionRoutes.js
├── middleware/         # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   ├── upload.js
│   └── errorHandler.js
├── utils/              # Utility functions
│   ├── jwt.js
│   ├── bcrypt.js
│   ├── validation.js
│   └── constants.js
├── config/             # Configuration files
│   ├── database.js
│   ├── multer.js
│   └── socket.js
├── uploads/            # File upload storage
│   ├── images/
│   └── documents/
└── server.js           # Application entry point
```

## Design Patterns

### 1. Repository Pattern
Used for data access abstraction:

```javascript
// models/User.js
class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
}
```

### 2. Service Layer Pattern
Business logic encapsulation:

```javascript
// services/AuthService.js
class AuthService {
  async register(userData) {
    // Business logic for user registration
    // Validation, password hashing, token generation
  }

  async login(credentials) {
    // Business logic for user authentication
    // Credential validation, token generation
  }
}
```

### 3. Middleware Pattern
Cross-cutting concerns:

```javascript
// middleware/auth.js
const authenticate = (req, res, next) => {
  // Authentication logic
  // Token validation, user extraction
  next();
};

// middleware/validation.js
const validateInput = (schema) => {
  return (req, res, next) => {
    // Input validation logic
    next();
  };
};
```

### 4. Factory Pattern
For creating different types of objects:

```javascript
// utils/ResponseFactory.js
class ResponseFactory {
  static success(data, message = 'Success') {
    return {
      success: true,
      message,
      data,
      error: null
    };
  }

  static error(message, error = null) {
    return {
      success: false,
      message,
      data: null,
      error
    };
  }
}
```

## Data Flow

### Request Processing Flow

```
Client Request
      ↓
Rate Limiting Middleware
      ↓
Authentication Middleware
      ↓
Validation Middleware
      ↓
Route Handler
      ↓
Controller Method
      ↓
Service Layer
      ↓
Repository Layer
      ↓
Database
      ↓
Response Formation
      ↓
Error Handling Middleware
      ↓
Client Response
```

### Example: User Registration Flow

```
1. POST /api/auth/register
2. Rate limiting check
3. Input validation middleware
4. AuthController.register()
5. AuthService.register()
6. UserRepository.create()
7. MongoDB save operation
8. JWT token generation
9. Response formatting
10. Send response to client
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                   Security Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    JWT      │ │    RBAC     │ │   Input     │           │
│  │    Auth     │ │   (Roles)   │ │ Validation  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │    Rate     │ │   CORS      │ │   Helmet    │           │
│  │  Limiting   │ │  Protection │ │  (Headers)  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Security Measures

1. **JWT Authentication**
   - Stateless token-based authentication
   - Token expiration and refresh mechanism
   - Secure token storage recommendations

2. **Password Security**
   - bcrypt hashing with salt rounds
   - Password strength validation
   - Secure password reset flow

3. **Input Validation**
   - Schema-based validation
   - SQL injection prevention
   - XSS protection

4. **Rate Limiting**
   - IP-based rate limiting
   - Endpoint-specific limits
   - DDoS protection

5. **File Upload Security**
   - File type validation
   - Size limitations
   - Secure file storage

## Database Architecture

### Database Design

```
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Cluster                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Primary   │ │  Secondary  │ │  Secondary  │           │
│  │   Replica   │ │   Replica   │ │   Replica   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Connection Management

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,          // Maximum number of connections
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4                 // Use IPv4, skip trying IPv6
  };

  await mongoose.connect(process.env.MONGODB_URI, options);
};
```

### Indexing Strategy

```javascript
// Compound indexes for efficient queries
db.submissions.createIndex({ userId: 1, problemId: 1, submittedAt: -1 });
db.problems.createIndex({ difficulty: 1, category: 1 });
db.users.createIndex({ email: 1 }, { unique: true });
```

## API Architecture

### RESTful Design Principles

1. **Resource-Based URLs**
   - `/api/users` - User resources
   - `/api/problems` - Problem resources
   - `/api/submissions` - Submission resources

2. **HTTP Methods**
   - GET: Retrieve resources
   - POST: Create new resources
   - PUT: Update existing resources
   - DELETE: Remove resources

3. **Status Codes**
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

4. **Response Format**
   ```json
   {
     "success": boolean,
     "message": string,
     "data": object,
     "error": object
   }
   ```

### API Versioning

```javascript
// routes/index.js
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

## Real-Time Architecture

### WebSocket Implementation

```javascript
// config/socket.js
const setupSocket = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.use(socketAuth); // Authentication middleware

  io.on('connection', (socket) => {
    // Handle real-time events
    socket.on('join_room', handleJoinRoom);
    socket.on('leave_room', handleLeaveRoom);
    socket.on('send_message', handleSendMessage);
  });
};
```

### Real-Time Features

1. **Live Submissions**
   - Real-time submission status updates
   - Live leaderboard updates

2. **Chat System**
   - Room-based messaging
   - User presence indicators

3. **Notifications**
   - System announcements
   - Contest updates

## Error Handling Architecture

### Error Handling Strategy

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

## Performance Optimization

### Caching Strategy

```javascript
// utils/cache.js
const redis = require('redis');
const client = redis.createClient();

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
```

### Database Optimization

1. **Indexing**
   - Create indexes on frequently queried fields
   - Use compound indexes for complex queries

2. **Query Optimization**
   - Use projection to limit returned fields
   - Implement pagination for large result sets

3. **Connection Pooling**
   - Configure appropriate pool size
   - Monitor connection usage

## Monitoring and Logging

### Logging Strategy

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Health Monitoring

```javascript
// routes/health.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  });
});
```

## Deployment Architecture

### Production Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
│                   (Nginx/HAProxy)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Application Servers                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Node.js   │ │   Node.js   │ │   Node.js   │           │
│  │ Instance 1  │ │ Instance 2  │ │ Instance 3  │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Database Cluster                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  MongoDB    │ │   Redis     │ │ File System │           │
│  │  Primary    │ │   Cache     │ │   Storage   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Scaling Strategies

1. **Horizontal Scaling**
   - Multiple application instances
   - Load balancing across instances
   - Session management with Redis

2. **Vertical Scaling**
   - Increase server resources
   - Optimize application performance
   - Database optimization

3. **Database Scaling**
   - Read replicas for read-heavy operations
   - Sharding for large datasets
   - Caching layer for frequently accessed data

## Future Enhancements

### Planned Architectural Improvements

1. **Microservices Migration**
   - Split monolith into microservices
   - Service mesh implementation
   - API gateway integration

2. **Event-Driven Architecture**
   - Message queues for async processing
   - Event sourcing for audit trails
   - CQRS pattern implementation

3. **Container Orchestration**
   - Docker containerization
   - Kubernetes deployment
   - Auto-scaling capabilities

4. **Advanced Caching**
   - CDN integration
   - Multi-level caching
   - Cache warming strategies

This architecture provides a solid foundation for a scalable, maintainable, and secure coding platform backend.
```