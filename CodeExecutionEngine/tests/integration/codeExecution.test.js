const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const CodeSubmission = require('../../models/CodeSubmission');
const testSetup = require('../setup');
const mongoose = require('mongoose');

// Mock Docker operations for integration tests
jest.mock('../../services/DockerManager');

describe('Code Execution API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    await testSetup.setup();
  }, 30000);

  afterAll(async () => {
    await testSetup.teardown();
  }, 30000);

  beforeEach(async () => {
    await testSetup.clearDatabase();
    
    // Create test user for each test
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    console.log('Login response:', loginResponse.status, loginResponse.body);
    
    if (loginResponse.body && loginResponse.body.data && loginResponse.body.data.token) {
      authToken = loginResponse.body.data.token;
    } else {
      // If login fails, create token manually for testing
      const jwt = require('jsonwebtoken');
      authToken = jwt.sign(
        { id: testUser._id }, 
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );
    }
  });

  describe('POST /api/code/submit', () => {
    it('should submit code successfully', async () => {
      const validProblemId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post('/api/code/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          problemId: validProblemId.toString(),
          code: 'print("Hello World")',
          language: 'python'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('submissionId');
    });

    it('should reject invalid language', async () => {
      const validProblemId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .post('/api/code/submit')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          problemId: validProblemId.toString(),
          code: 'console.log("Hello")',
          language: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should enforce rate limiting', async () => {
      const validProblemId = new mongoose.Types.ObjectId();
      
      // Make 11 requests quickly (limit is 10 per minute)
      const requests = Array.from({ length: 11 }, () =>
        request(app)
          .post('/api/code/submit')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            problemId: validProblemId.toString(),
            code: 'print("test")',
            language: 'python'
          })
      );

      const responses = await Promise.all(requests);
      const rateLimitedResponse = responses.find(r => r.status === 429);
      
      expect(rateLimitedResponse).toBeDefined();
    });
  });

  describe('GET /api/code/languages', () => {
    it('should return supported languages', async () => {
      const response = await request(app)
        .get('/api/code/languages');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('python');
      expect(response.body.data).toHaveProperty('java');
      expect(response.body.data).toHaveProperty('cpp');
    });
  });
});
