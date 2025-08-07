# Code Execution Platform API Documentation

## Overview
This API provides code execution services for multiple programming languages with automated test case validation.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Code Execution API

### Submit Code for Execution
**POST** `/code/submit`

Submit code for a specific problem and get results.

**Request Body:**
```json
{
  "problemId": "507f1f77bcf86cd799439011",
  "language": "python",
  "code": "def twoSum(self, nums: List[int], target: int) -> List[int]:\n    # Your solution here\n    pass"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code submitted successfully",
  "data": {
    "submissionId": "507f1f77bcf86cd799439012",
    "status": "pending"
  }
}
```

### Execute Code (Real-time)
**POST** `/code/execute`

Execute code immediately and get output.

**Request Body:**
```json
{
  "code": "print('Hello World')",
  "language": "python",
  "problemId": "507f1f77bcf86cd799439011", // optional
  "input": "test input" // optional
}
```

**Response:**
```json
{
  "success": true,
  "output": "Hello World\n",
  "error": "",
  "executionTime": 45,
  "memoryUsed": 1024,
  "status": "success"
}
```

### Get Submission Status
**GET** `/code/submission/:submissionId`

Get the status and results of a submission.

**Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": "507f1f77bcf86cd799439012",
    "status": "completed",
    "verdict": "accepted",
    "testResults": [
      {
        "testCase": 1,
        "status": "passed",
        "executionTime": 12,
        "memoryUsed": 512
      }
    ]
  }
}
```

### Get User Submissions
**GET** `/code/submissions`

Get all submissions for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `language` (optional): Filter by language
- `problemId` (optional): Filter by problem

**Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "problem": {
          "_id": "507f1f77bcf86cd799439011",
          "title": "Two Sum"
        },
        "language": "python",
        "status": "accepted",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### Get Supported Languages
**GET** `/code/languages`

Get list of supported programming languages.

**Response:**
```json
{
  "success": true,
  "data": {
    "python": {
      "name": "Python",
      "version": "3.9",
      "fileExtension": ".py",
      "supported": true
    },
    "java": {
      "name": "Java",
      "version": "17",
      "fileExtension": ".java",
      "supported": true
    },
    "cpp": {
      "name": "C++",
      "version": "17",
      "fileExtension": ".cpp",
      "supported": true
    },
    "javascript": {
      "name": "JavaScript",
      "version": "ES11",
      "fileExtension": ".js",
      "supported": true
    },
    "c": {
      "name": "C",
      "version": "GCC 9",
      "fileExtension": ".c",
      "supported": true
    }
  }
}
```

## Problems API

### Get All Problems
**GET** `/problems`

Get list of all problems.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Two Sum",
      "difficulty": "easy",
      "tags": ["array", "hash-table"],
      "description": "Given an array of integers...",
      "testCases": [
        {
          "input": "[2,7,11,15]\n9",
          "output": "[0,1]",
          "isHidden": false
        }
      ],
      "functionSignatures": {
        "python": "def twoSum(self, nums: List[int], target: int) -> List[int]:",
        "java": "public int[] twoSum(int[] nums, int target)",
        "cpp": "vector<int> twoSum(vector<int>& nums, int target)"
      }
    }
  ]
}
```

### Get Problem by ID
**GET** `/problems/:id`

Get detailed information about a specific problem.

### Create Problem
**POST** `/problems`

Create a new problem (admin only).

**Request Body:**
```json
{
  "title": "New Problem",
  "description": "Problem description...",
  "difficulty": "medium",
  "tags": ["array", "sorting"],
  "testCases": [
    {
      "input": "test input",
      "output": "expected output",
      "isHidden": false
    }
  ],
  "functionSignatures": {
    "python": "def solution(self, arr: List[int]) -> int:",
    "java": "public int solution(int[] arr)",
    "cpp": "int solution(vector<int>& arr)"
  },
  "timeLimit": 2000,
  "memoryLimit": 256
}
```

### Update Problem
**PUT** `/problems/:id`

Update an existing problem (admin only).

### Delete Problem
**DELETE** `/problems/:id`

Delete a problem (admin only).

## Authentication API

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login User
**POST** `/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439013",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional array of detailed errors
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- General API calls: 1000 requests per hour
- Code execution: 100 requests per hour
- Code submission: 50 requests per hour

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)
    },
    "c": {
      "name": "C",
      "version": "GCC 9",
      "fileExtension": ".c",
      "supported": true
    }
  }
}
```

### Get Code Template

**GET** `/api/code/template/:language`

Get starter code template for a specific programming language.

**Path Parameters:**
- `language`: Programming language (`python`, `java`, `cpp`, `javascript`, `c`)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "language": "python",
    "template": "def solution():\n    # write your function here\n    pass\n\n# Test your solution\nif __name__ == \"__main__\":\n    result = solution()\n    print(result)"
  }
}
```
> **Note:**  
> - The actual template used for a problem is stored per-problem and per-language in the `templates` field of the problem.  
> - The `/api/code/template/:language` endpoint returns a generic starter template for that language, not the problem-specific template.

---

## Admin Endpoints

### Get System Statistics

**GET** `/api/code/admin/stats`

Get system-wide execution statistics (admin only).

**Headers:**
- `Authorization: Bearer <admin-token>` (required)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "queue": {
      "currentQueueLength": 0,
      "isProcessing": false,
      "currentExecutions": 0,
      "maxConcurrentExecutions": 5
    },
    "system": {
      "uptime": 6.688503459,
      "memoryUsage": {
        "rss": 60047360,
        "heapTotal": 63602688,
        "heapUsed": 29221600,
        "external": 37571567,
        "arrayBuffers": 18436030
      },
      "cpuUsage": {
        "user": 339659,
        "system": 97206
      }
    },
    "statistics": {
      "totalSubmissions24h": 17,
      "statusBreakdown": {
        "accepted": 13,
        "wrong_answer": 4
      },
      "languageBreakdown": {
        "python": 4,
        "java": 2,
        "cpp": 11
      },
      "averageExecutionTime": 1846
    },
    "timestamp": "2025-07-13T15:11:36.812Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Admin access required

---

## System Endpoints

### Health Check

**GET** `/health`

Check API health status.

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2023-12-07T10:30:00.000Z",
  "uptime": 3600.45,
  "environment": "development"
}
```

### Metrics

**GET** `/metrics`

Get Prometheus-style metrics for monitoring.

**Response (200):**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status_code="200"} 1024
...
```

---

## Data Models

### User Model
```javascript
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "role": "user|admin",
  "isActive": "boolean",
  "lastLogin": "Date",
  "submissionCount": "number",
  "solvedProblems": ["ObjectId"],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Code Submission Model
```javascript
{
  "_id": "ObjectId",
  "user": "ObjectId",
  "problem": "ObjectId",
  "code": "string",
  "language": "python|java|cpp|javascript|c",
  "status": "pending|running|accepted|wrong_answer|runtime_error|compile_error|time_limit_exceeded|memory_limit_exceeded|system_error",
  "executionResults": [
    {
      "testCase": "ObjectId",
      "input": "string",
      "expectedOutput": "string",
      "actualOutput": "string",
      "executionTime": "number", // milliseconds
      "memoryUsed": "number", // KB
      "status": "passed|failed|tle|mle|rte|ce",
      "errorMessage": "string"
    }
  ],
  "overallResult": {
    "totalTests": "number",
    "passedTests": "number",
    "failedTests": "number",
    "totalExecutionTime": "number",
    "maxMemoryUsed": "number",
    "verdict": "string"
  },
  "complexityAnalysis": {
    "timeComplexity": {
      "estimated": "string",
      "confidence": "number",
      "analysis": "string"
    },
    "spaceComplexity": {
      "estimated": "string",
      "confidence": "number",
      "analysis": "string"
    }
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Problem Model
```javascript
{
  "_id": "ObjectId",
  "title": "string",
  "description": "string",
  "difficulty": "easy|medium|hard",
  "tags": ["string"],
  "timeLimit": "number",
  "memoryLimit": "number",
  "examples": [
    { "input": "string", "output": "string", "explanation": "string" }
  ],
  "constraints": "string",
  "hints": ["string"],
  "isActive": "boolean",
  "createdBy": "ObjectId",
  "submissionCount": "number",
  "acceptedCount": "number",
  "acceptanceRate": "number",
  "templates": {
    "python": "string",
    "java": "string",
    "cpp": "string",
    "javascript": "string",
    "c": "string"
  },
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
> **Note:**  
> - The `templates` field is a map of language to template string, and is required for each problem.

---

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Too many code submissions. Please try again later."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **Docker Isolation**: Code execution in isolated containers
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: Security headers protection
- **Password Hashing**: Bcrypt with salt rounds
- **Request Size Limits**: 50MB limit for code submissions

---

## Development & Testing

### Environment Variables
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeplatform
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
```

### Testing Endpoints

You can test the API using the provided test scripts:

1. **Full API Test**: `./testFull.sh`
2. **Basic Setup Test**: `./test-setup.sh`

Or use curl commands:

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Submit code
curl -X POST http://localhost:5000/api/code/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"problemId":"60f7b3b3b3b3b3b3b3b3b3b1","language":"python","code":"print(\"Hello World\")"}'
```

---

## Support

For issues and questions:
- Check the logs at `/logs/error.log` and `/logs/combined.log`
- Review the test files in `/tests/` directory
- Check the monitoring metrics at `/metrics` endpoint

**Note**: This API is designed for production use with comprehensive error handling, security measures, and monitoring capabilities.

# Problems API

## List Problems

**GET** `/api/problems?difficulty=&tag=&page=&limit=`

- Returns a paginated list of problems.
- Optional query params: `difficulty`, `tag`, `page`, `limit`.

---

## Get Problem Details

**GET** `/api/problems/:problemId`

- Returns problem details and test cases (all if admin/creator, only visible if user).
- Requires authentication.

---

## Create Problem

**POST** `/api/problems`

- Admin only.
- Body: `{ title, description, difficulty, tags, ..., testCases: [ { input, expectedOutput, isHidden, ... } ], templates: { python: "...", java: "...", ... } }`
- Requires authentication.

**Example Request Body:**
```json
{
  "title": "Add Two Numbers",
  "description": "Write a function that adds two numbers.",
  "difficulty": "easy",
  "tags": ["math"],
  "testCases": [
    { "input": "{\"a\":5,\"b\":3}", "expectedOutput": "8", "isHidden": false },
    { "input": "{\"a\":-2,\"b\":7}", "expectedOutput": "5", "isHidden": false }
  ],
  "templates": {
    "python": "# write your function here\ndef solution(a, b):\n    # write your function here\n    pass",
    "java": "// write your function here\npublic static int solution(int a, int b) {\n    // write your function here\n    return 0;\n}"
    // ...other languages...
  }
}
```
> **Note:**  
> - The `templates` field is required and must provide the full code template for each supported language.  
> - The template must include a marker (e.g. `// write your function here` or `# write your function here`) where the user's function implementation will be inserted during code execution.  
> - The template code is not editable by users during code submission.

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "problemId",
    "title": "Add Two Numbers",
    "...": "...",
    "testCases": [
      {
        "_id": "testCaseId1",
        "problem": "problemId",
        "input": "{\"a\":5,\"b\":3}",
        "expectedOutput": "8",
        "isHidden": false,
        "...": "..."
      },
      {
        "_id": "testCaseId2",
        "problem": "problemId",
        "input": "{\"a\":-2,\"b\":7}",
        "expectedOutput": "5",
        "isHidden": false,
        "...": "..."
      }
    ]
  }
}
```

---

## Update Problem

**PUT** `/api/problems/:problemId`

- Admin or creator only.
- Body: fields to update (including `templates` if needed).
- Requires authentication.

---

## Delete Problem

**DELETE** `/api/problems/:problemId`

- Admin or creator only.
- Requires authentication.

---

## List Test Cases for a Problem

**GET** `/api/problems/:problemId/testcases`

- Returns test cases for a problem (all if admin/creator, only visible if user).
- Requires authentication.

---

## Add Test Case

**POST** `/api/problems/:problemId/testcases`

- Admin or creator only.
- Body: `{ input, expectedOutput, isHidden, ... }`
- Requires authentication.

---

## Update Test Case

**PUT** `/api/problems/testcases/:testCaseId`

- Admin or creator only.
- Body: fields to update.
- Requires authentication.

---

## Delete Test Case

**DELETE** `/api/problems/testcases/:testCaseId`

- Admin or creator only.
- Requires authentication.

---

## Code Execution

### Execute Code with Automatic Driver Generation

**POST** `/api/code/execute`

Executes code with automatic driver code generation for problem-based submissions.

#### Request Body
```json
{
  "code": "string (required) - User's solution code",
  "language": "string (required) - Programming language (cpp, python, java)",
  "problemId": "string (optional) - Problem ID for automatic driver generation",
  "input": "string (optional) - Custom input for standalone execution"
}
```

#### Response
```json
{
  "output": "string - Execution output",
  "error": "string - Error message if any",
  "executionTime": "number - Execution time in ms",
  "memoryUsed": "number - Memory used in KB",
  "status": "string - success/error/timeout"
}
```

#### Features
- **Automatic Driver Code Generation**: When `problemId` is provided, the system automatically generates test driver code
- **Multiple Language Support**: C++, Python, and Java
- **Data Structure Parsing**: Automatically handles arrays, linked lists, trees, etc.
- **Test Case Execution**: Runs all test cases and compares outputs
- **Fallback Support**: Falls back to user code if driver generation fails

## Problems

### Create Problem

**POST** `/api/problems`

#### Request Body
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "difficulty": "string (required) - Easy/Medium/Hard",
  "tags": ["string"] (optional),
  "testCases": [
    {
      "input": "string (required) - Test input",
      "output": "string (required) - Expected output"
    }
  ],
  "functionSignatures": {
    "cpp": "string - C++ function signature",
    "python": "string - Python function signature", 
    "java": "string - Java function signature"
  },
  "timeLimit": "number (optional) - Time limit in seconds",
  "memoryLimit": "number (optional) - Memory limit in MB"
}
```

#### Function Signature Examples

**C++:**
```cpp
vector<int> twoSum(vector<int>& nums, int target)
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2)
int maxDepth(TreeNode* root)
```

**Python:**
```python
def twoSum(self, nums: List[int], target: int) -> List[int]:
def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
def maxDepth(self, root: Optional[TreeNode]) -> int:
```

**Java:**
```java
public int[] twoSum(int[] nums, int target)
public ListNode mergeTwoLists(ListNode list1, ListNode list2)
public int maxDepth(TreeNode root)
```

---

## Driver Code Generation

The system automatically generates driver code that:

1. **Parses Input Data**: Converts string inputs to appropriate data structures
2. **Creates Objects**: Instantiates LinkedList, TreeNode, and other objects
3. **Calls User Function**: Invokes the user's solution with parsed inputs
4. **Compares Output**: Displays actual vs expected results
5. **Handles Multiple Test Cases**: Runs all test cases automatically

### Supported Data Types

- **Primitive Types**: int, string, boolean
- **Arrays**: vector<int> (C++), List[int] (Python), int[] (Java)
- **Linked Lists**: ListNode structures
- **Binary Trees**: TreeNode structures
- **2D Arrays**: Nested array structures

### Input Format Examples

```
Arrays: [1,2,3,4]
2D Arrays: [[1,2],[3,4]]
Linked Lists: [1,2,3,4]
Strings: "hello"
Integers: 42
```
