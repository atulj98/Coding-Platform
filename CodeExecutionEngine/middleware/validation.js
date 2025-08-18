const { body, validationResult } = require('express-validator');

const validateCodeSubmission = [
  body('problemId')
    .isMongoId()
    .withMessage('Invalid problem ID'),
  body('code')
    .isLength({ min: 1, max: 50000 })
    .withMessage('Code must be between 1 and 50000 characters'),
  body('language')
    .isIn(['python', 'java', 'cpp', 'javascript', 'c'])
    .withMessage('Invalid language'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateCodeSubmission
};
