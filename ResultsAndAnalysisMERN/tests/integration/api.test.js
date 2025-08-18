const request = require('supertest');
const mongoose = require('mongoose');

// Import models first, then app
const Submission = require('../../models/Submission');
const Problem = require('../../models/Problem');

// Mock the mongoose connection in app.js to prevent it from connecting
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue(true)
  };
});

const app = require('../../app');

// Restore mongoose after mocking
const realMongoose = jest.requireActual('mongoose');

describe('Results and Analysis API Integration Tests', () => {
  let testSubmission1, testSubmission2, testProblem;

  beforeEach(async () => {
    // Create test problem
    testProblem = await Problem.create({
      title: 'Test Problem',
      description: 'A test problem',
      difficulty: 'MEDIUM',
      testCases: [
        { input: '1 2', expectedOutput: '3', isPublic: true }
      ]
    });

    // Create test submissions
    testSubmission1 = await Submission.create({
      userId: 'user123',
      problemId: testProblem._id.toString(),
      code: 'console.log("test")',
      language: 'javascript',
      status: 'COMPLETED',
      result: {
        success: true,
        totalTestCases: 5,
        passedTestCases: 5,
        failedTestCases: 0,
        totalExecutionTime: 150,
        maxMemoryUsed: 512,
        score: 100,
        testCaseResults: [
          {
            input: '1 2',
            expectedOutput: '3',
            actualOutput: '3',
            passed: true,
            executionTime: 30,
            memoryUsed: 128
          }
        ]
      },
      completedAt: new Date()
    });

    testSubmission2 = await Submission.create({
      userId: 'user456',
      problemId: testProblem._id.toString(),
      code: 'print("test")',
      language: 'python',
      status: 'COMPLETED',
      result: {
        success: false,
        totalTestCases: 5,
        passedTestCases: 2,
        failedTestCases: 3,
        totalExecutionTime: 200,
        maxMemoryUsed: 768,
        score: 40,
        testCaseResults: []
      },
      completedAt: new Date()
    });
  });

  describe('Results Endpoints', () => {
    describe('GET /api/results/recent', () => {
      it('should return recent submissions', async () => {
        const response = await request(app)
          .get('/api/results/recent')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body[0]).toHaveProperty('userId');
        expect(response.body[0]).toHaveProperty('result');
      });

      it('should respect limit parameter', async () => {
        const response = await request(app)
          .get('/api/results/recent?limit=1')
          .expect(200);

        expect(response.body.length).toBe(1);
      });
    });

    describe('GET /api/results/:submissionId', () => {
      it('should return specific submission', async () => {
        const response = await request(app)
          .get(`/api/results/${testSubmission1._id}`)
          .expect(200);

        expect(response.body._id).toBe(testSubmission1._id.toString());
        expect(response.body.userId).toBe('user123');
      });

      it('should return 404 for non-existent submission', async () => {
        const fakeId = new realMongoose.Types.ObjectId();
        await request(app)
          .get(`/api/results/${fakeId}`)
          .expect(404);
      });
    });

    describe('GET /api/results/user/:userId', () => {
      it('should return user submissions with pagination', async () => {
        const response = await request(app)
          .get('/api/results/user/user123')
          .expect(200);

        expect(response.body).toHaveProperty('submissions');
        expect(response.body).toHaveProperty('pagination');
        expect(response.body.submissions.length).toBe(1);
        expect(response.body.pagination.total).toBe(1);
      });

      it('should filter by status', async () => {
        const response = await request(app)
          .get('/api/results/user/user123?status=COMPLETED')
          .expect(200);

        expect(response.body.submissions.length).toBe(1);
      });

      it('should filter by problemId', async () => {
        const response = await request(app)
          .get(`/api/results/user/user123?problemId=${testProblem._id}`)
          .expect(200);

        expect(response.body.submissions.length).toBe(1);
      });
    });

    describe('GET /api/results/problem/:problemId/stats', () => {
      it('should return problem statistics', async () => {
        const response = await request(app)
          .get(`/api/results/problem/${testProblem._id}/stats`)
          .expect(200);

        expect(response.body).toHaveProperty('totalSubmissions');
        expect(response.body).toHaveProperty('successfulSubmissions');
        expect(response.body).toHaveProperty('successRate');
        expect(response.body.totalSubmissions).toBe(2);
        expect(response.body.successfulSubmissions).toBe(1);
        expect(response.body.successRate).toBe('50.00');
      });
    });

    describe('GET /api/results/user/:userId/problem/:problemId', () => {
      it('should return user submissions for specific problem', async () => {
        const response = await request(app)
          .get(`/api/results/user/user123/problem/${testProblem._id}`)
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(1);
        expect(response.body[0].userId).toBe('user123');
      });
    });

    describe('GET /api/results/trends', () => {
      it('should return submission trends', async () => {
        const response = await request(app)
          .get('/api/results/trends?days=7')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
      });
    });
  });

  describe('Analysis Endpoints', () => {
    describe('GET /api/analysis/user/:userId/performance', () => {
      it('should return user performance analysis', async () => {
        const response = await request(app)
          .get('/api/analysis/user/user123/performance')
          .expect(200);

        expect(response.body).toHaveProperty('totalSubmissions');
        expect(response.body).toHaveProperty('successfulSubmissions');
        expect(response.body).toHaveProperty('averageScore');
        expect(response.body.totalSubmissions).toBe(1);
        expect(response.body.successfulSubmissions).toBe(1);
      });

      it('should filter by timeframe', async () => {
        const response = await request(app)
          .get('/api/analysis/user/user123/performance?timeframe=7d')
          .expect(200);

        expect(response.body).toHaveProperty('totalSubmissions');
      });
    });

    describe('GET /api/analysis/problem/:problemId/difficulty', () => {
      it('should analyze problem difficulty', async () => {
        const response = await request(app)
          .get(`/api/analysis/problem/${testProblem._id}/difficulty`)
          .expect(200);

        expect(response.body).toHaveProperty('totalAttempts');
        expect(response.body).toHaveProperty('successfulAttempts');
        expect(response.body).toHaveProperty('difficultyScore');
        expect(response.body).toHaveProperty('estimatedDifficulty');
        expect(response.body.totalAttempts).toBe(2);
        expect(response.body.successfulAttempts).toBe(1);
      });
    });

    describe('GET /api/analysis/trends', () => {
      it('should return submission trends', async () => {
        const response = await request(app)
          .get('/api/analysis/trends?period=daily&limit=5')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
      });
    });

    describe('GET /api/analysis/leaderboard', () => {
      it('should return leaderboard', async () => {
        const response = await request(app)
          .get('/api/analysis/leaderboard?limit=10')
          .expect(200);

        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('userId');
        expect(response.body[0]).toHaveProperty('totalScore');
        expect(response.body[0]).toHaveProperty('uniqueProblemsSolved');
      });
    });

    describe('GET /api/analysis/analytics/:userId', () => {
      it('should return detailed user analytics', async () => {
        const response = await request(app)
          .get('/api/analysis/analytics/user123')
          .expect(200);

        expect(response.body).toHaveProperty('basicStats');
        expect(response.body).toHaveProperty('languageBreakdown');
        expect(response.body).toHaveProperty('weeklyProgress');
        expect(response.body).toHaveProperty('problemDifficultyStats');
      });
    });
  });

  describe('Health Check', () => {
    it('should return service health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('service', 'ResultsAndAnalysisMERN');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid submission ID format', async () => {
      await request(app)
        .get('/api/results/invalid-id')
        .expect(400); // Changed from 500 to 400 - this is correct behavior
    });

    it('should handle non-existent user', async () => {
      const response = await request(app)
        .get('/api/results/user/nonexistent')
        .expect(200);

      expect(response.body.submissions).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should handle non-existent problem stats', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/results/problem/${fakeId}/stats`)
        .expect(200);

      expect(response.body.totalSubmissions).toBe(0);
    });
  });
});
