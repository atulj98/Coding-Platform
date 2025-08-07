const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all problems
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, tags, search } = req.query;
    
    // Build query
    const query = { isActive: true };
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count and problems
    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .select('-testCases') // Don't send test cases in list view
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    res.json({
      success: true,
      data: {
        problems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching problems:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems'
    });
  }
});

// Get a specific problem
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('-testCases.output') // Hide expected outputs
      .lean();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      data: problem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get test cases for a problem (authenticated users only)
router.get('/:id/testcases', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('testCases')
      .lean();

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Only show non-hidden test cases to regular users
    // Admins can see all test cases
    const testCases = problem.testCases || [];
    const visibleTestCases = req.user.role === 'admin' 
      ? testCases 
      : testCases.filter(tc => !tc.isHidden);

    res.json({
      success: true,
      data: visibleTestCases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create a new problem (authenticated users only)
router.post('/', 
  auth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    body('testCases').isArray().withMessage('Test cases must be an array'),
    body('functionSignatures').optional().isObject().withMessage('Function signatures must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        difficulty,
        tags,
        testCases,
        functionSignatures,
        timeLimit,
        memoryLimit
      } = req.body;

      // Convert functionSignatures object to Map
      const signatures = new Map();
      if (functionSignatures && typeof functionSignatures === 'object') {
        Object.entries(functionSignatures).forEach(([lang, sig]) => {
          if (sig && sig.trim()) {
            signatures.set(lang.toLowerCase(), sig.trim());
          }
        });
      }

      const problem = new Problem({
        title,
        description,
        difficulty: difficulty.toLowerCase(),
        tags: tags || [],
        testCases: testCases || [],
        functionSignatures: signatures,
        timeLimit: timeLimit || 2000,
        memoryLimit: memoryLimit || 256,
        createdBy: req.user._id
      });

      await problem.save();

      res.status(201).json({
        success: true,
        data: problem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Update a problem (authenticated users only)
router.put('/:id', 
  auth,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    body('testCases').optional().isArray().withMessage('Test cases must be an array'),
    body('functionSignatures').optional().isObject().withMessage('Function signatures must be an object')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found'
        });
      }

      // Check if user owns the problem or is admin
      if (problem.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      const updateData = { ...req.body };
      
      // Handle functionSignatures conversion
      if (updateData.functionSignatures && typeof updateData.functionSignatures === 'object') {
        const signatures = new Map();
        Object.entries(updateData.functionSignatures).forEach(([lang, sig]) => {
          if (sig && sig.trim()) {
            signatures.set(lang.toLowerCase(), sig.trim());
          }
        });
        updateData.functionSignatures = signatures;
      }

      // Normalize difficulty
      if (updateData.difficulty) {
        updateData.difficulty = updateData.difficulty.toLowerCase();
      }

      const updatedProblem = await Problem.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        data: updatedProblem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Delete a problem (authenticated users only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if user owns the problem or is admin
    if (problem.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Problem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get problems by user (authenticated users only)
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Users can only see their own problems unless they're admin
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const problems = await Problem.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Problem.countDocuments({ createdBy: userId });

    res.json({
      success: true,
      data: {
        problems,
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

// Search problems
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    };

    const problems = await Problem.find(searchQuery)
      .select('-testCases.output')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Problem.countDocuments(searchQuery);

    res.json({
      success: true,
      data: {
        problems,
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

module.exports = router;
