const Problem = require('../../models/Problem');

exports.createProblem = async (req, res) => {
  try {
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

    const problem = new Problem({
      title,
      description,
      difficulty,
      tags,
      testCases,
      functionSignatures: new Map(Object.entries(functionSignatures || {})),
      timeLimit,
      memoryLimit,
      createdBy: req.user._id
    });

    await problem.save();
    res.status(201).json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.functionSignatures) {
      updateData.functionSignatures = new Map(Object.entries(updateData.functionSignatures));
    }

    const problem = await Problem.findByIdAndUpdate(id, updateData, { new: true });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id).populate('createdBy', 'username');

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const { page = 1, limit = 20, difficulty, tags, search } = req.query;
    
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

    const problems = await Problem.find(query)
      .select('title difficulty tags submissionCount acceptedCount acceptanceRate')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Problem.countDocuments(query);

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
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Check if user is the creator or admin
    if (problem.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Problem.findByIdAndDelete(id);
    res.json({ success: true, message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProblemTestCases = async (req, res) => {
  try {
    const { id } = req.params;
    const { includeHidden = false } = req.query;
    
    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    let testCases = problem.testCases;
    
    // Filter out hidden test cases unless specifically requested
    if (!includeHidden || req.user.role !== 'admin') {
      testCases = testCases.filter(tc => !tc.isHidden);
    }

    res.json({ success: true, data: testCases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProblemStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionCount, acceptedCount } = req.body;

    const problem = await Problem.findById(id);
    
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    if (submissionCount !== undefined) {
      problem.submissionCount = submissionCount;
    }
    
    if (acceptedCount !== undefined) {
      problem.acceptedCount = acceptedCount;
    }

    await problem.save();
    
    res.json({ success: true, data: problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};