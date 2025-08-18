const express = require('express');
const router = express.Router();
const CodeExecutor = require('../services/CodeExecutor');
const CodeSubmission = require('../models/CodeSubmission');
const { auth } = require('../middleware/auth');
const { validateCodeSubmission } = require('../middleware/validation');
const rateLimiter = require('../middleware/rateLimiter');
const driverCodeGenerator = require('../src/services/driverCodeGenerator');
const Problem = require('../models/Problem');

// Submit code for execution
router.post('/submit', auth, rateLimiter.codeSubmission, validateCodeSubmission, async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user._id;

    const result = await CodeExecutor.submitCode(userId, problemId, code, language);
    
    res.status(201).json({
      success: true,
      message: 'Code submitted successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get submission status
router.get('/submission/:submissionId', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await CodeExecutor.getSubmissionStatus(submissionId);
    
    // Check if user owns this submission
    if (submission.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Get detailed submission results
router.get('/submission/:submissionId/results', auth, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const results = await CodeExecutor.getSubmissionResults(submissionId);
    
    // Check if user owns this submission
    if (results.submission.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's submissions
router.get('/submissions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, language, problemId } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (status) query.status = status;
    if (language) query.language = language;
    if (problemId) query.problem = problemId;

    const submissions = await CodeSubmission.find(query)
      .populate('problem', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await CodeSubmission.countDocuments(query);

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  const languages = {
    python: {
      name: 'Python',
      version: '3.9',
      fileExtension: '.py',
      supported: true
    },
    java: {
      name: 'Java',
      version: '17',
      fileExtension: '.java',
      supported: true
    },
    cpp: {
      name: 'C++',
      version: '17',
      fileExtension: '.cpp',
      supported: true
    },
    javascript: {
      name: 'JavaScript',
      version: 'Node.js 16',
      fileExtension: '.js',
      supported: true
    },
    c: {
      name: 'C',
      version: 'GCC 9',
      fileExtension: '.c',
      supported: true
    }
  };

  res.json({
    success: true,
    data: languages
  });
});

// Get code template for a language
router.get('/template/:language', (req, res) => {
  const { language } = req.params;
  const fs = require('fs');
  const path = require('path');

  try {
    const templatePath = path.join(__dirname, '../templates', `${language}.${language === 'cpp' ? 'cpp' : language}`);
    const template = fs.readFileSync(templatePath, 'utf8');

    res.json({
      success: true,
      data: {
        language,
        template
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: 'Template not found'
    });
  }
});

router.get('/timeouts', (req, res) => {
  const { language, baseTimeout = 2000 } = req.query;
  
  const getLanguageTimeout = (lang, base) => {
    const languageMultipliers = {
      'java': 3.0,
      'python': 1.5,
      'javascript': 1.2,
      'cpp': 1.0,
      'c': 1.0
    };
    
    const multiplier = languageMultipliers[lang] || 1.0;
    return Math.max(base * multiplier, lang === 'java' ? 5000 : base);
  };

  const languages = ['java', 'python', 'javascript', 'cpp', 'c'];
  const timeouts = {};
  
  if (language) {
    timeouts[language] = getLanguageTimeout(language, parseInt(baseTimeout));
  } else {
    languages.forEach(lang => {
      timeouts[lang] = getLanguageTimeout(lang, parseInt(baseTimeout));
    });
  }

  res.json({
    success: true,
    data: {
      baseTimeout: parseInt(baseTimeout),
      adjustedTimeouts: timeouts
    }
  });
});

// Admin routes
router.get('/admin/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const stats = await CodeExecutor.getSystemStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add execute endpoint for real-time code execution
router.post('/execute', auth, async (req, res) => {
  try {
    const { code, language, problemId, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }

    let finalCode = code;
    let executionInput = input || '';

    // Declare limits before driver code generation
    const limits = {
      time: 5000, // 5 seconds
      memory: 256, // 256 MB
      language: language
    };

    // If problemId is provided, generate driver code automatically
    if (problemId) {
      try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
          return res.status(404).json({
            success: false,
            message: 'Problem not found'
          });
        }

        // Get function signature for the language
        const functionSignature = problem.functionSignatures.get(language.toLowerCase());
        if (functionSignature && problem.testCases && problem.testCases.length > 0) {
          console.log('=== DRIVER CODE GENERATION DEBUG ===');
          console.log('Problem ID:', problemId);
          console.log('Language:', language);
          console.log('Function Signature:', functionSignature);
          console.log('Test Cases Count:', problem.testCases.length);
          console.log('User Code:', code);
          
          // Convert Mongoose documents to plain objects
          const plainTestCases = problem.testCases.map(tc => ({
            input: tc.input,
            output: tc.output,
            isHidden: tc.isHidden,
            _id: tc._id
          }));
          
          console.log('Plain test cases:', plainTestCases);
          
          // Generate driver code
          finalCode = driverCodeGenerator.generate(
            language,
            functionSignature,
            plainTestCases,
            code,
            problem.description || ''
          );
          // For Java, ensure filename is Main.java and code is written to /app/code
          if (language === 'java') {
            limits.filename = 'Main.java';
          }
          
          console.log('Generated Driver Code:');
          console.log(finalCode);
          console.log('====================================');
          
          // Use the first test case input for execution
          executionInput = plainTestCases[0].input;
        }
      } catch (driverError) {
        console.warn('Driver code generation failed:', driverError.message);
        console.error('Driver error stack:', driverError.stack);
        // Fall back to original code
        finalCode = code;
      }
    }

    // Execute the code using DockerManager
    const DockerManager = require('../services/DockerManager');
    try {
      const { executionId } = await DockerManager.createContainer(
        language,
        '', // No template needed for direct execution - driver code is already generated
        finalCode,
        executionInput,
        limits // limits.filename will be used if present
      );

      const result = await DockerManager.executeContainer(executionId, limits.time);

      // Enhanced response with better error handling
      const response = {
        success: true,
        output: result.stdout || '',
        error: result.stderr || '',
        executionTime: result.executionTime || 0,
        memoryUsed: result.stats?.memoryUsed || 0,
        status: 'success'
      };

      // Determine the actual status based on execution results
      if (result.killed) {
        response.status = 'timeout';
        response.error = result.stderr || 'Time Limit Exceeded';
      } else if (result.exitCode !== 0) {
        response.status = 'error';
        if (!response.error && response.output) {
          response.error = response.output;
          response.output = '';
        }
      }

      // If we have no output and no error, but execution failed
      if (!response.output && !response.error && result.exitCode !== 0) {
        response.error = `Execution failed with exit code ${result.exitCode}`;
        response.status = 'error';
      }

      console.log('=== FINAL API RESPONSE ===');
      console.log('Response:', JSON.stringify(response, null, 2));
      console.log('==========================');

      res.json(response);

    } catch (execError) {
      console.error('Execution error:', execError);
      res.json({
        success: false,
        output: '',
        error: execError.message || 'Execution failed',
        executionTime: 0,
        memoryUsed: 0,
        status: 'error'
      });
    }

  } catch (error) {
    console.error('Execute endpoint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
});

/*
API documentation update (example request body for POST /api/code/submit):

{
  "problemId": "PROBLEM_OBJECT_ID_PLACEHOLDER",
  "language": "python",
  "code": "    # user function implementation only\n    n = len(s)\n    dp = [[0]*n for _ in range(n)]\n    for i in range(n-1, -1, -1):\n        dp[i][i] = 1\n        for j in range(i+1, n):\n            if s[i] == s[j]:\n                dp[i][j] = dp[i+1][j-1] + 2\n            else:\n                dp[i][j] = max(dp[i+1][j], dp[i][j-1])\n    return dp[0][n-1]"
}

Note: Only the function implementation (the code to be inserted at the marker in the template) should be submitted. The template code is stored with the problem and cannot be changed by the user.
*/

module.exports = router;
/*
{
  "problemId": "PROBLEM_OBJECT_ID_PLACEHOLDER",
  "language": "python",
  "code": "    # user function implementation only\n    n = len(s)\n    dp = [[0]*n for _ in range(n)]\n    for i in range(n-1, -1, -1):\n        dp[i][i] = 1\n        for j in range(i+1, n):\n            if s[i] == s[j]:\n                dp[i][j] = dp[i+1][j-1] + 2\n            else:\n                dp[i][j] = max(dp[i+1][j], dp[i][j-1])\n    return dp[0][n-1]"
}
*/
