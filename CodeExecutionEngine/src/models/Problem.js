import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
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
  }],
  functionSignatures: {
    type: Map,
    of: String,
    default: new Map([
      ['cpp', ''],
      ['python', ''],
      ['java', '']
    ])
  },
  timeLimit: {
    type: Number,
    default: 5000 // milliseconds (increased from 1000)
  },
  memoryLimit: {
    type: Number,
    default: 256 // MB
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;