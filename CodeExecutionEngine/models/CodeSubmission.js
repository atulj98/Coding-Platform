const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  code: {
    type: String,
    required: true,
    maxlength: 50000 // 50KB limit
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'java', 'cpp', 'javascript', 'c']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'compile_error', 'time_limit_exceeded', 'memory_limit_exceeded', 'system_error'],
    default: 'pending'
  },
  executionResults: [{
    testCase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TestCase'
    },
    input: String,
    expectedOutput: String,
    actualOutput: String,
    executionTime: Number, // in milliseconds
    memoryUsed: Number, // in KB
    status: {
      type: String,
      enum: ['passed', 'failed', 'tle', 'mle', 'rte', 'ce']
    },
    errorMessage: String
  }],
  overallResult: {
    totalTests: Number,
    passedTests: Number,
    failedTests: Number,
    totalExecutionTime: Number,
    maxMemoryUsed: Number,
    verdict: String
  },
  complexityAnalysis: {
    timeComplexity: {
      estimated: String,
      confidence: Number,
      analysis: String
    },
    spaceComplexity: {
      estimated: String,
      confidence: Number,
      analysis: String
    }
  },
  compilationOutput: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  executedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
codeSubmissionSchema.index({ user: 1, problem: 1, createdAt: -1 });
codeSubmissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
