const Submission = require('../models/Submission');
const mongoose = require('mongoose');

class ResultsService {
  async getSubmissionResults(submissionId) {
    // Validate if submissionId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new Error('Invalid submission ID format');
    }
    return await Submission.findById(submissionId);
  }

  async getSubmissionsByUser(userId, options) {
    const { page, limit, status, problemId } = options;
    const query = { userId };
    if (status) query.status = status;
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-code'); // Exclude code for performance

    const total = await Submission.countDocuments(query);

    return {
      submissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getProblemStatistics(problemId) {
    const stats = await Submission.aggregate([
      { $match: { problemId, status: 'COMPLETED' } },
      {
        $group: {
          _id: '$result.success',
          count: { $sum: 1 },
          avgExecutionTime: { $avg: '$result.totalExecutionTime' },
          avgMemoryUsed: { $avg: '$result.maxMemoryUsed' },
          avgScore: { $avg: '$result.score' }
        }
      }
    ]);

    const languageStats = await Submission.aggregate([
      { $match: { problemId, status: 'COMPLETED' } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          successCount: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          },
          avgExecutionTime: { $avg: '$result.totalExecutionTime' }
        }
      }
    ]);

    const totalSubmissions = await Submission.countDocuments({ 
      problemId, 
      status: 'COMPLETED' 
    });
    
    const successfulSubmissions = stats.find(s => s._id === true)?.count || 0;
    const failedSubmissions = stats.find(s => s._id === false)?.count || 0;

    return {
      totalSubmissions,
      successfulSubmissions,
      failedSubmissions,
      successRate: totalSubmissions > 0 ? (successfulSubmissions / totalSubmissions * 100).toFixed(2) : 0,
      languageBreakdown: languageStats,
      overallStats: stats
    };
  }

  async getRecentSubmissions(limit = 10) {
    return await Submission.find({ status: 'COMPLETED' })
      .sort({ completedAt: -1 })
      .limit(limit)
      .select('userId problemId language result.success result.score submittedAt completedAt')
      .populate('problemId', 'title difficulty');
  }

  async getUserSubmissionsByProblem(userId, problemId) {
    return await Submission.find({ userId, problemId })
      .sort({ submittedAt: -1 })
      .select('-code');
  }

  async getSubmissionTrends(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await Submission.aggregate([
      { 
        $match: { 
          submittedAt: { $gte: startDate },
          status: 'COMPLETED'
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$submittedAt' 
            } 
          },
          totalSubmissions: { $sum: 1 },
          successfulSubmissions: { 
            $sum: { $cond: [{ $eq: ['$result.success', true] }, 1, 0] } 
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
}

module.exports = new ResultsService();
