const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    default: 5000 // milliseconds (increased from 2000)
  },
  memoryLimit: {
    type: Number,
    default: 256 // MB
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: String,
  hints: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  submissionCount: {
    type: Number,
    default: 0
  },
  acceptedCount: {
    type: Number,
    default: 0
  },
  acceptanceRate: {
    type: Number,
    default: 0
  },
  templates: {
    type: Map,
    of: String,
    default: {}
  },
  functionSignatures: {
    type: Map,
    of: String,
    default: new Map([
      ['cpp', ''],
      ['python', ''],
      ['java', '']
    ])
  },
  testCases: [{
    input: {
      type: String,
      required: true
    },
    output: {
      type: String,
      required: true
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Calculate acceptance rate before saving
problemSchema.pre('save', function(next) {
  if (this.submissionCount > 0) {
    this.acceptanceRate = (this.acceptedCount / this.submissionCount) * 100;
  }
  next();
});

module.exports = mongoose.model('Problem', problemSchema);
module.exports = mongoose.model('Problem', problemSchema);
