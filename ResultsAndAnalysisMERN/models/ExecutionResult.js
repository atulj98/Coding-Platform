const mongoose = require('mongoose');

const testCaseResultSchema = new mongoose.Schema({
  testCaseId: { type: String, required: true },
  status: { type: String, enum: ['PASSED', 'FAILED', 'ERROR'], required: true },
  actualOutput: String,
  expectedOutput: String,
  executionTime: Number,
  memoryUsed: Number
});

const executionResultSchema = new mongoose.Schema({
  executionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  problemId: { type: String, required: true },
  submissionId: String,
  language: { type: String, required: true },
  status: { type: String, enum: ['PASSED', 'FAILED', 'ERROR', 'TIMEOUT'], required: true },
  totalExecutionTime: Number,
  memoryUsage: Number,
  testCaseResults: [testCaseResultSchema],
  errorMessage: String,
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 100 },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

executionResultSchema.index({ userId: 1, timestamp: -1 });
executionResultSchema.index({ problemId: 1 });
executionResultSchema.index({ executionId: 1 });

module.exports = mongoose.model('ExecutionResult', executionResultSchema);
