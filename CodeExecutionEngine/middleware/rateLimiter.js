const rateLimit = require('express-rate-limit');

const codeSubmissionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 submissions per minute
  message: {
    success: false,
    message: 'Too many code submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 100 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  }
});

module.exports = {
  codeSubmission: codeSubmissionLimiter,
  general: generalLimiter
};
