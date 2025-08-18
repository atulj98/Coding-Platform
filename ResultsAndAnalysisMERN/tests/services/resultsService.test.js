const resultsService = require('../../services/resultsService');
const Submission = require('../../models/Submission');

describe('ResultsService', () => {
  let testSubmission;

  beforeEach(async () => {
    testSubmission = await Submission.create({
      userId: 'user123',
      problemId: 'problem456',
      code: 'test code',
      language: 'javascript',
      status: 'COMPLETED',
      result: {
        success: true,
        totalTestCases: 3,
        passedTestCases: 3,
        failedTestCases: 0,
        totalExecutionTime: 100,
        maxMemoryUsed: 256,
        score: 100
      }
    });
  });

  describe('getSubmissionResults', () => {
    it('should return submission by ID', async () => {
      const result = await resultsService.getSubmissionResults(testSubmission._id);
      expect(result).toBeTruthy();
      expect(result.userId).toBe('user123');
    });

    it('should return null for non-existent submission', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const result = await resultsService.getSubmissionResults(fakeId);
      expect(result).toBeNull();
    });
  });

  describe('getSubmissionsByUser', () => {
    it('should return user submissions with pagination', async () => {
      const result = await resultsService.getSubmissionsByUser('user123', {
        page: 1,
        limit: 10
      });

      expect(result).toHaveProperty('submissions');
      expect(result).toHaveProperty('pagination');
      expect(result.submissions.length).toBe(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should filter by status', async () => {
      const result = await resultsService.getSubmissionsByUser('user123', {
        page: 1,
        limit: 10,
        status: 'COMPLETED'
      });

      expect(result.submissions.length).toBe(1);
    });
  });

  // ...existing code for other service methods...
});
