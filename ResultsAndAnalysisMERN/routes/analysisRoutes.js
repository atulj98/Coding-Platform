const express = require('express');
const analysisController = require('../controllers/analysisController');

const router = express.Router();

// Get user performance analysis
router.get('/user/:userId/performance', analysisController.getUserPerformance);

// Get problem difficulty analysis
router.get('/problem/:problemId/difficulty', analysisController.getProblemDifficulty);

// Get submission trends
router.get('/trends', analysisController.getSubmissionTrends);

// Get leaderboard
router.get('/leaderboard', analysisController.getLeaderboard);

// Get detailed analytics
router.get('/analytics/:userId', analysisController.getDetailedAnalytics);

module.exports = router;
