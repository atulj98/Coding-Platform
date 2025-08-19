const crypto = require('crypto');

const generateExecutionId = () => {
  return crypto.randomBytes(16).toString('hex');
};

const formatExecutionTime = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
};

const formatMemoryUsage = (bytes) => {
  if (bytes < 1024) {
    return `${bytes}B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)}KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  }
};

const sanitizeOutput = (output, maxLength = 10000) => {
  if (!output) return '';
  
  // Remove null bytes and control characters
  let sanitized = output.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Truncate if too long
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '\n... (output truncated)';
  }
  
  return sanitized;
};

const compareOutputs = (actual, expected) => {
  // Normalize whitespace
  const normalizeWhitespace = (str) => {
    return str.trim().replace(/\s+/g, ' ');
  };
  
  const normalizedActual = normalizeWhitespace(actual);
  const normalizedExpected = normalizeWhitespace(expected);
  
  return normalizedActual === normalizedExpected;
};

const getComplexityScore = (timeComplexity, spaceComplexity) => {
  const complexityScores = {
    'O(1)': 10,
    'O(log n)': 9,
    'O(n)': 8,
    'O(n log n)': 7,
    'O(n²)': 5,
    'O(n³)': 3,
    'O(2^n)': 1,
    'O(n!)': 0
  };
  
  const timeScore = complexityScores[timeComplexity] || 5;
  const spaceScore = complexityScores[spaceComplexity] || 5;
  
  return Math.round((timeScore + spaceScore) / 2);
};

const isValidTestCase = (input, expectedOutput) => {
  if (typeof input !== 'string' || typeof expectedOutput !== 'string') {
    return false;
  }
  
  if (input.length > 100000 || expectedOutput.length > 100000) {
    return false;
  }
  
  return true;
};

module.exports = {
  generateExecutionId,
  formatExecutionTime,
  formatMemoryUsage,
  sanitizeOutput,
  compareOutputs,
  getComplexityScore,
  isValidTestCase
};
