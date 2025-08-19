const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
  isPublic: { type: Boolean, default: false }
});

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['EASY', 'MEDIUM', 'HARD'],
    default: 'MEDIUM'
  },
  tags: [String],
  testCases: [testCaseSchema],
  constraints: String,
  timeLimit: { type: Number, default: 5000 }, // in milliseconds
  memoryLimit: { type: Number, default: 128 }, // in MB
  createdBy: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Problem', problemSchema);
