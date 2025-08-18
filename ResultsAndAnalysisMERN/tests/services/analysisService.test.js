const analysisService = require('../../services/analysisService');
const Submission = require('../../models/Submission');

describe('AnalysisService', () => {
  beforeEach(async () => {
    // Create test data
    await Submission.create([
      {
        userId: 'user1',
        problemId: 'problem1',
        code: 'test',
        language: 'javascript',
        status: 'COMPLETED',
        result: { success: true, score: 100, totalExecutionTime: 150 },
        submittedAt: new Date()
      },
      {
        userId: 'user1',
        problemId: 'problem2',
        code: 'test',
        language: 'python',
        status: 'COMPLETED',
        result: { success: false, score: 50, totalExecutionTime: 200 },
        submittedAt: new Date()
      }
    ]);
  });

  describe('getUserPerformanceAnalysis', () => {
    it('should return user performance metrics', async () => {
      const result = await analysisService.getUserPerformanceAnalysis('user1', '30d');

      expect(result).toHaveProperty('totalSubmissions', 2);
      expect(result).toHaveProperty('successfulSubmissions', 1);
      expect(result).toHaveProperty('successRate', '50.00');
    });
  });

  describe('analyzeProblemDifficulty', () => {
    it('should analyze problem difficulty', async () => {
      const result = await analysisService.analyzeProblemDifficulty('problem1');

      expect(result).toHaveProperty('totalAttempts');
      expect(result).toHaveProperty('successfulAttempts');
      expect(result).toHaveProperty('difficultyScore');
    });
  });

  // ...existing code for other analysis methods...
});
