# Database Documentation

This document describes the database schema, relationships, and data models used in the Coding Platform Backend.

## Database Technology

- **Database**: MongoDB
- **ODM**: Mongoose
- **Connection**: MongoDB Atlas / Local MongoDB instance

## Collections Overview

The database consists of the following main collections:

1. **users** - User accounts and authentication
2. **problems** - Coding problems and test cases
3. **submissions** - User code submissions
4. **files** - Uploaded file metadata

## User Schema

### Collection: `users`

Stores user account information and authentication data.

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hashed with bcrypt
  role: String, // 'user' | 'admin'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: Unique index for email lookup
- `username`: Unique index for username lookup
- `createdAt`: Index for sorting by creation date

**Validation Rules:**
- `username`: Required, 3-50 characters, alphanumeric and underscores only
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters (stored hashed)
- `role`: Required, enum ['user', 'admin'], default 'user'
- `isActive`: Boolean, default true

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2b$10$...", // Hashed password
  "role": "user",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Problem Schema

### Collection: `problems`

Stores coding problems with test cases and metadata.

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  difficulty: String, // 'easy' | 'medium' | 'hard'
  category: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
      isHidden: Boolean
    }
  ],
  constraints: String,
  tags: [String],
  createdBy: ObjectId, // Reference to users
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `title`: Text index for search
- `difficulty`: Index for filtering
- `category`: Index for filtering
- `createdBy`: Index for admin queries
- `createdAt`: Index for sorting

**Validation Rules:**
- `title`: Required, 1-200 characters, unique
- `description`: Required, minimum 10 characters
- `difficulty`: Required, enum ['easy', 'medium', 'hard']
- `category`: Required, string
- `testCases`: Required array, minimum 1 test case
- `constraints`: Optional string
- `tags`: Optional array of strings
- `createdBy`: Required ObjectId reference to users
- `isActive`: Boolean, default true

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "difficulty": "easy",
  "category": "arrays",
  "testCases": [
    {
      "input": "[2,7,11,15], 9",
      "expectedOutput": "[0,1]",
      "isHidden": false
    },
    {
      "input": "[3,2,4], 6",
      "expectedOutput": "[1,2]",
      "isHidden": true
    }
  ],
  "constraints": "2 <= nums.length <= 10^4",
  "tags": ["array", "hash-table"],
  "createdBy": "507f1f77bcf86cd799439011",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Submission Schema

### Collection: `submissions`

Stores user code submissions and execution results.

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to users
  problemId: ObjectId, // Reference to problems
  code: String,
  language: String, // 'javascript' | 'python' | 'java' | 'cpp'
  status: String, // 'pending' | 'accepted' | 'rejected' | 'error'
  result: {
    testCasesPassed: Number,
    totalTestCases: Number,
    executionTime: String,
    memoryUsed: String,
    error: String
  },
  submittedAt: Date,
  evaluatedAt: Date
}
```

**Indexes:**
- `userId`: Index for user queries
- `problemId`: Index for problem queries
- `status`: Index for filtering
- `submittedAt`: Index for sorting
- Compound index: `userId, problemId, submittedAt`

**Validation Rules:**
- `userId`: Required ObjectId reference to users
- `problemId`: Required ObjectId reference to problems
- `code`: Required string, minimum 1 character
- `language`: Required, enum ['javascript', 'python', 'java', 'cpp']
- `status`: Required, enum ['pending', 'accepted', 'rejected', 'error']
- `result`: Optional object with execution details
- `submittedAt`: Required date, default Date.now
- `evaluatedAt`: Optional date

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "problemId": "507f1f77bcf86cd799439012",
  "code": "function twoSum(nums, target) {\n  // solution code\n}",
  "language": "javascript",
  "status": "accepted",
  "result": {
    "testCasesPassed": 5,
    "totalTestCases": 5,
    "executionTime": "100ms",
    "memoryUsed": "50MB",
    "error": null
  },
  "submittedAt": "2024-01-01T00:00:00.000Z",
  "evaluatedAt": "2024-01-01T00:00:05.000Z"
}
```

## File Schema

### Collection: `files`

Stores metadata for uploaded files.

```javascript
{
  _id: ObjectId,
  originalName: String,
  filename: String,
  mimetype: String,
  size: Number,
  path: String,
  uploadedBy: ObjectId, // Reference to users
  fileType: String, // 'image' | 'document'
  isActive: Boolean,
  uploadedAt: Date
}
```

**Indexes:**
- `uploadedBy`: Index for user queries
- `fileType`: Index for filtering
- `uploadedAt`: Index for sorting

**Validation Rules:**
- `originalName`: Required string
- `filename`: Required string, unique
- `mimetype`: Required string
- `size`: Required number
- `path`: Required string
- `uploadedBy`: Required ObjectId reference to users
- `fileType`: Required, enum ['image', 'document']
- `isActive`: Boolean, default true
- `uploadedAt`: Required date, default Date.now

**Sample Document:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "originalName": "profile-pic.jpg",
  "filename": "1704067200000-profile-pic.jpg",
  "mimetype": "image/jpeg",
  "size": 1024000,
  "path": "/uploads/images/1704067200000-profile-pic.jpg",
  "uploadedBy": "507f1f77bcf86cd799439011",
  "fileType": "image",
  "isActive": true,
  "uploadedAt": "2024-01-01T00:00:00.000Z"
}
```

## Relationships

### User → Problems (One-to-Many)
- A user can create multiple problems
- `problems.createdBy` references `users._id`

### User → Submissions (One-to-Many)
- A user can have multiple submissions
- `submissions.userId` references `users._id`

### Problem → Submissions (One-to-Many)
- A problem can have multiple submissions
- `submissions.problemId` references `problems._id`

### User → Files (One-to-Many)
- A user can upload multiple files
- `files.uploadedBy` references `users._id`

## Database Queries

### Common Query Patterns

#### User Authentication
```javascript
// Find user by email
db.users.findOne({ email: "user@example.com" });

// Find active users
db.users.find({ isActive: true });
```

#### Problem Queries
```javascript
// Find problems by difficulty
db.problems.find({ difficulty: "easy", isActive: true });

// Search problems by title
db.problems.find({ 
  title: { $regex: "search term", $options: "i" },
  isActive: true 
});

// Find problems with pagination
db.problems.find({ isActive: true })
  .sort({ createdAt: -1 })
  .skip(10)
  .limit(10);
```

#### Submission Queries
```javascript
// Find user submissions
db.submissions.find({ userId: ObjectId("...") })
  .sort({ submittedAt: -1 });

// Find problem submissions
db.submissions.find({ problemId: ObjectId("...") })
  .populate("userId", "username");

// Find accepted submissions
db.submissions.find({ status: "accepted" });
```

#### Aggregation Queries
```javascript
// User submission statistics
db.submissions.aggregate([
  { $match: { userId: ObjectId("...") } },
  { $group: {
    _id: "$status",
    count: { $sum: 1 }
  }}
]);

// Problem difficulty distribution
db.problems.aggregate([
  { $match: { isActive: true } },
  { $group: {
    _id: "$difficulty",
    count: { $sum: 1 }
  }}
]);
```

## Database Configuration

### Connection String
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/codingplatform
# or for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codingplatform
```

## Data Validation

### Mongoose Validation
All schemas include built-in validation:
- Required fields
- Data types
- String length limits
- Enum values
- Custom validators

### Custom Validation Examples
```javascript
// Email validation
email: {
  type: String,
  required: true,
  unique: true,
  validate: {
    validator: function(v) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
    },
    message: 'Please enter a valid email'
  }
}

// Password strength validation
password: {
  type: String,
  required: true,
  minlength: 6,
  validate: {
    validator: function(v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v);
    },
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  }
}
```

## Performance Optimization

### Indexing Strategy
- Create indexes on frequently queried fields
- Use compound indexes for complex queries
- Monitor index usage and performance

### Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation pipeline for complex operations

### Connection Pooling
- Configure appropriate pool size
- Set connection timeouts
- Handle connection errors gracefully

## Backup and Recovery

### Backup Strategy
```bash
# Create backup
mongodump --uri="mongodb://localhost:27017/codingplatform" --out=/backup/path

# Restore backup
mongorestore --uri="mongodb://localhost:27017/codingplatform" /backup/path/codingplatform
```

### Data Migration
- Use migration scripts for schema changes
- Implement version control for database changes
- Test migrations in development environment first
```