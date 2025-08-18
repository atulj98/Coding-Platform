const analysisService = require('../services/analysisService');

class AnalysisController {
  async getUserPerformance(req, res, next) {
    try {
      const { userId } = req.params;
      const { timeframe = '30d' } = req.query;
      const performance = await analysisService.getUserPerformanceAnalysis(userId, timeframe);
      res.json(performance);
    } catch (error) {
      next(error);
    }
  }

  async getProblemDifficulty(req, res, next) {
    try {
      const { problemId } = req.params;
      const difficulty = await analysisService.analyzeProblemDifficulty(problemId);
      res.json(difficulty);
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionTrends(req, res, next) {
    try {
      const { period = 'weekly', limit = 10 } = req.query;
      const trends = await analysisService.getSubmissionTrends(period, limit);
      res.json(trends);
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req, res, next) {
    try {
      const { limit = 50, timeframe = 'all' } = req.query;
      const leaderboard = await analysisService.generateLeaderboard(limit, timeframe);
      res.json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  async getDetailedAnalytics(req, res, next) {
    try {
      const { userId } = req.params;
      const analytics = await analysisService.getDetailedUserAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalysisController();
