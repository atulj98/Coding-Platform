const mongoose = require('mongoose');

const executionResultSchema = new mongoose.Schema({
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodeSubmission',
    required: true
  },
  executionId: {
    type: String,
    required: true,
    unique: true
  },
  containerId: String,
  startTime: Date,
  endTime: Date,
  executionTime: Number, // in milliseconds
  memoryUsed: Number, // in KB
  cpuUsage: Number, // percentage
  exitCode: Number,
  signal: String,
  stdout: String,
  stderr: String,
  metrics: {
    peakMemory: Number,
    avgCpuUsage: Number,
    diskIo: Number,
    networkIo: Number
  },
  securityViolations: [{
    type: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ExecutionResult', executionResultSchema);
