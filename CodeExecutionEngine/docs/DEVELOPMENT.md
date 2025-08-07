# Development Guide

## Table of Contents

1. [Code Structure](#code-structure)
2. [Error Handling](#error-handling)
3. [Debugging](#debugging)
4. [Logging](#logging)
5. [Performance Optimization](#performance-optimization)
6. [Security Best Practices](#security-best-practices)
7. [Package Scripts](#package-scripts)
8. [Development Tools](#development-tools)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices Summary](#best-practices-summary)

## Code Structure

```
/project-root
│
├── /config
│   ├── database.js
│   └── server.js
│
├── /controllers
│   ├── authController.js
│   └── userController.js
│
├── /middleware
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── sanitize.js
│
├── /models
│   ├── User.js
│   └── Post.js
│
├── /routes
│   ├── authRoutes.js
│   └── userRoutes.js
│
├── /seeds
│   └── index.js
│
├── /scripts
│   └── resetDatabase.js
│
├── /tests
│   ├── authController.test.js
│   └── userController.test.js
│
├── /uploads
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Error Handling

### Custom Error Classes

```javascript
// utils/errors.js
class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// utils/errors/ValidationError.js
class ValidationError extends BaseError {
  constructor(message) {
    super(message, 400);
  }
}

// utils/errors/NotFoundError.js
class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404);
  }
}

// utils/errors/AuthenticationError.js
class AuthenticationError extends BaseError {
  constructor(message) {
    super(message, 401);
  }
}

module.exports = {
  BaseError,
  ValidationError,
  NotFoundError,
  AuthenticationError
};
```

### Global Error Handler

```javascript
// middleware/errorHandler.js
const { BaseError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new BaseError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new BaseError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new BaseError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new BaseError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;
```

## Debugging

### Debug Configuration

```javascript
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Logging

```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'coding-platform-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## Performance Optimization

### Database Optimization

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Caching Implementation

```javascript
// middleware/cache.js
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

const cache = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Cache error:', error);
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      try {
        await client.setex(key, duration, JSON.stringify(body));
      } catch (error) {
        console.error('Cache set error:', error);
      }
      res.sendResponse(body);
    };

    next();
  };
};

module.exports = { cache };
```

## Security Best Practices

### Input Sanitization

```javascript
// middleware/sanitize.js
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const sanitizeInput = (app) => {
  // Prevent NoSQL injections
  app.use(mongoSanitize());
  
  // Clean user input from malicious HTML
  app.use(xss());
  
  // Prevent parameter pollution
  app.use(hpp());
};

module.exports = sanitizeInput;
```

### Rate Limiting

```javascript
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many authentication attempts, please try again later'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100 // limit each IP to 100 requests per windowMs
);

module.exports = {
  authLimiter,
  generalLimiter
};
```

## Package Scripts

### package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "db:seed": "node seeds/index.js",
    "db:reset": "node scripts/resetDatabase.js",
    "build": "npm run lint && npm run test",
    "precommit": "npm run lint && npm run test"
  }
}
```

## Development Tools

### Recommended VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next",
    "humao.rest-client"
  ]
}
```

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "node_modules": true,
    ".env": true,
    "uploads": true
  }
}
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo journalctl -u mongod
```

#### 2. Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### 3. Module Not Found Errors
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Jest Tests Failing
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- controllers/authController.test.js

# Update snapshots
npm test -- --updateSnapshot
```

### Debug Commands

```bash
# Start with debug logging
DEBUG=* npm run dev

# Check package vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Update packages
npm update
```

## Best Practices Summary

### Code Quality
- Write self-documenting code
- Use meaningful variable names
- Keep functions small and focused
- Follow DRY principle
- Add comments for complex logic

### Security
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Hash passwords securely
- Keep dependencies updated

### Performance
- Use database indexes
- Implement caching
- Optimize queries
- Monitor performance metrics
- Use compression middleware

### Testing
- Write tests for all new features
- Maintain high test coverage
- Use descriptive test names
- Mock external dependencies
- Test edge cases

### Documentation
- Keep README updated
- Document API endpoints
- Add inline code comments
- Update changelog
- Document deployment process

This development guide provides a comprehensive foundation for maintaining code quality, security, and performance standards in the project.