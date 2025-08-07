const resultsService = require('../services/resultsService');

class ResultsController {
  async getResults(req, res, next) {
    try {
      const { submissionId } = req.params;
      const results = await resultsService.getSubmissionResults(submissionId);
      if (!results) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(results);
    } catch (error) {
      if (error.message === 'Invalid submission ID format') {
        return res.status(400).json({ error: 'Invalid submission ID format' });
      }
      next(error);
    }
  }

  async getUserResults(req, res, next) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, status, problemId } = req.query;
      const results = await resultsService.getSubmissionsByUser(userId, { 
        page, 
        limit, 
        status, 
        problemId 
      });
      res.json(results);
    } catch (error) {
      next(error);
    }
  }

  async getProblemStats(req, res, next) {
    try {
      const { problemId } = req.params;
      const stats = await resultsService.getProblemStatistics(problemId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getRecentSubmissions(req, res, next) {
    try {
      const { limit = 10 } = req.query;
      const submissions = await resultsService.getRecentSubmissions(parseInt(limit));
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  }

  async getUserProblemSubmissions(req, res, next) {
    try {
      const { userId, problemId } = req.params;
      const submissions = await resultsService.getUserSubmissionsByProblem(userId, problemId);
      res.json(submissions);
    } catch (error) {
      next(error);
    }
  }

  async getSubmissionTrends(req, res, next) {
    try {
      const { days = 30 } = req.query;
      const trends = await resultsService.getSubmissionTrends(parseInt(days));
      res.json(trends);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ResultsController();

