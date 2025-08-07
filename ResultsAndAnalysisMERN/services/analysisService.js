const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

class AnalysisService {
  async getUserPerformanceAnalysis(userId, timeframe) {
    const dateFilter = this.getDateFilter(timeframe);
    
    const performance = await Submission.aggregate([
      { 
        $match: { 
          userId, 
          status: 'COMPLETED',
          submittedAt: dateFilter 
        } 
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          successfulSubmissions: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          averageScore: { $avg: '$result.score' },
          averageExecutionTime: { $avg: '$result.totalExecutionTime' },
          averageMemoryUsed: { $avg: '$result.maxMemoryUsed' },
          languagesUsed: { $addToSet: '$language' },
          problemsSolved: { $addToSet: '$problemId' }
        }
      }
    ]);

    const result = performance[0] || {};
    if (result.problemsSolved) {
      result.uniqueProblemsAttempted = result.problemsSolved.length;
      delete result.problemsSolved;
    }
    if (result.totalSubmissions) {
      result.successRate = ((result.successfulSubmissions / result.totalSubmissions) * 100).toFixed(2);
    }

    return result;
  }

  async analyzeProblemDifficulty(problemId) {
    const analysis = await Submission.aggregate([
      { $match: { problemId, status: 'COMPLETED' } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          successfulAttempts: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          averageExecutionTime: { $avg: '$result.totalExecutionTime' },
          averageMemoryUsed: { $avg: '$result.maxMemoryUsed' },
          averageScore: { $avg: '$result.score' },
          uniqueUsers: { $addToSet: '$userId' }
        }
      }
    ]);

    const result = analysis[0] || {};
    if (result.uniqueUsers) {
      result.uniqueUsersAttempted = result.uniqueUsers.length;
      delete result.uniqueUsers;
    }
    
    result.difficultyScore = this.calculateDifficultyScore(result);
    result.estimatedDifficulty = this.estimateDifficulty(result.difficultyScore);
    
    return result;
  }

  async getSubmissionTrends(period, limit) {
    const groupBy = period === 'daily' ? '%Y-%m-%d' : '%Y-%m';
    
    return await Submission.aggregate([
      { $match: { status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: groupBy, date: '$submittedAt' } },
          submissions: { $sum: 1 },
          successful: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          averageScore: { $avg: '$result.score' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: parseInt(limit) }
    ]);
  }

  async generateLeaderboard(limit, timeframe) {
    const dateFilter = this.getDateFilter(timeframe);
    
    return await Submission.aggregate([
      { 
        $match: { 
          status: 'COMPLETED',
          'result.success': true,
          submittedAt: dateFilter 
        } 
      },
      {
        $group: {
          _id: '$userId',
          totalScore: { $sum: '$result.score' },
          problemsSolved: { $addToSet: '$problemId' },
          totalSubmissions: { $sum: 1 },
          averageExecutionTime: { $avg: '$result.totalExecutionTime' }
        }
      },
      {
        $addFields: {
          uniqueProblemsSolved: { $size: '$problemsSolved' }
        }
      },
      { 
        $sort: { 
          uniqueProblemsSolved: -1, 
          totalScore: -1, 
          averageExecutionTime: 1 
        } 
      },
      { $limit: parseInt(limit) },
      {
        $project: {
          userId: '$_id',
          totalScore: 1,
          uniqueProblemsSolved: 1,
          totalSubmissions: 1,
          averageExecutionTime: { $round: ['$averageExecutionTime', 2] },
          _id: 0
        }
      }
    ]);
  }

  async getDetailedUserAnalytics(userId) {
    const basicStats = await this.getUserPerformanceAnalysis(userId, 'all');
    
    const languageBreakdown = await Submission.aggregate([
      { $match: { userId, status: 'COMPLETED' } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          successCount: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          averageScore: { $avg: '$result.score' },
          averageExecutionTime: { $avg: '$result.totalExecutionTime' }
        }
      }
    ]);

    const weeklyProgress = await Submission.aggregate([
      { $match: { userId, status: 'COMPLETED' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$submittedAt' } },
          submissions: { $sum: 1 },
          successful: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          averageScore: { $avg: '$result.score' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const problemDifficultyStats = await Submission.aggregate([
      { 
        $match: { 
          userId, 
          status: 'COMPLETED',
          'result.success': true 
        } 
      },
      {
        $group: {
          _id: '$problemId',
          count: { $sum: 1 },
          averageScore: { $avg: '$result.score' }
        }
      }
    ]);

    return {
      basicStats,
      languageBreakdown,
      weeklyProgress,
      problemDifficultyStats
    };
  }

  getDateFilter(timeframe) {
    if (timeframe === 'all') return { $exists: true };
    const now = new Date();
    const days = parseInt(timeframe.replace('d', '')) || 30;
    return { $gte: new Date(now.getTime() - (days * 24 * 60 * 60 * 1000)) };
  }

  calculateDifficultyScore(data) {
    const { totalAttempts, successfulAttempts, averageExecutionTime, averageScore } = data;
    if (!totalAttempts) return 0;
    
    const successRate = (successfulAttempts / totalAttempts) * 100;
    const timeComplexity = averageExecutionTime > 1000 ? 20 : (averageExecutionTime / 1000) * 20;
    const scoreComplexity = averageScore < 50 ? 30 : (100 - averageScore) * 0.3;
    
    return Math.min(100, 100 - successRate + timeComplexity + scoreComplexity);
  }

  estimateDifficulty(score) {
    if (score <= 30) return 'EASY';
    if (score <= 60) return 'MEDIUM';
    return 'HARD';
  }
}

module.exports = new AnalysisService();
