const mongoose = require('mongoose');

const testCaseResultSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  executionTime: Number,
  memoryUsed: Number,
  error: String
});

const submissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  problemId: { type: String, required: true },
  code: { type: String, required: true },
  language: { 
    type: String, 
    required: true,
    enum: ['javascript', 'python', 'java', 'cpp', 'c']
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'RUNNING', 'COMPLETED', 'ERROR', 'TIMEOUT'],
    default: 'PENDING'
  },
  result: {
    success: { type: Boolean, default: false },
    totalTestCases: { type: Number, default: 0 },
    passedTestCases: { type: Number, default: 0 },
    failedTestCases: { type: Number, default: 0 },
    totalExecutionTime: { type: Number, default: 0 },
    maxMemoryUsed: { type: Number, default: 0 },
    testCaseResults: [testCaseResultSchema],
    error: String,
    score: { type: Number, default: 0 }
  },
  submittedAt: { type: Date, default: Date.now },
  completedAt: Date
}, {
  timestamps: true
});

submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ problemId: 1 });
submissionSchema.index({ userId: 1, problemId: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
