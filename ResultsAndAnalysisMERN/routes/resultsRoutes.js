const express = require('express');
const resultsController = require('../controllers/resultsController');

const router = express.Router();

// Put specific routes BEFORE parameterized routes to avoid conflicts
// Get recent submissions
router.get('/recent', resultsController.getRecentSubmissions);

// Get submission trends
router.get('/trends', resultsController.getSubmissionTrends);

// Get user submissions history
router.get('/user/:userId', resultsController.getUserResults);

// Get user submissions for specific problem
router.get('/user/:userId/problem/:problemId', resultsController.getUserProblemSubmissions);

// Get problem statistics
router.get('/problem/:problemId/stats', resultsController.getProblemStats);

// Get submission results by ID (this should be last among single param routes)
router.get('/:submissionId', resultsController.getResults);

module.exports = router;
