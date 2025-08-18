# Contributing Guidelines

Thank you for your interest in contributing to the Coding Platform Backend! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Show empathy towards other community members

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

1. **Bug Reports** - Help us identify and fix issues
2. **Feature Requests** - Suggest new features or improvements
3. **Code Contributions** - Fix bugs, implement features, or improve performance
4. **Documentation** - Improve existing docs or add new documentation
5. **Testing** - Add or improve test coverage
6. **Code Review** - Review pull requests from other contributors

### Getting Started

1. **Fork the Repository**
   ```bash
   # Click the "Fork" button on GitHub
   git clone https://github.com/your-username/codingPlatformBackend.git
   cd codingPlatformBackend
   ```

2. **Set Up Development Environment**
   ```bash
   # Add upstream remote
   git remote add upstream https://github.com/original-owner/codingPlatformBackend.git
   
   # Install dependencies
   npm install
   
   # Copy environment file
   cp .env.example .env
   
   # Start development server
   npm run dev
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for new features
- **feature/***: Individual feature development
- **bugfix/***: Bug fixes
- **hotfix/***: Critical production fixes

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or modifying tests
- **chore**: Maintenance tasks

#### Examples
```bash
feat(auth): add password reset functionality

Implement password reset flow with email verification.
Includes new API endpoints and email templates.

Closes #123
```

```bash
fix(validation): handle edge case in user input validation

Fix issue where special characters in usernames caused
validation errors.

Fixes #456
```

### Code Style Guidelines

#### JavaScript/Node.js Standards

1. **Use ES6+ features**
   ```javascript
   // Good
   const getUserById = async (id) => {
     const user = await User.findById(id);
     return user;
   };

   // Avoid
   function getUserById(id, callback) {
     User.findById(id, callback);
   }
   ```

2. **Use destructuring**
   ```javascript
   // Good
   const { username, email } = req.body;

   // Avoid
   const username = req.body.username;
   const email = req.body.email;
   ```

3. **Use template literals**
   ```javascript
   // Good
   const message = `Welcome ${username}!`;

   // Avoid
   const message = 'Welcome ' + username + '!';
   ```

4. **Handle async operations properly**
   ```javascript
   // Good
   try {
     const user = await User.findById(id);
     return user;
   } catch (error) {
     throw new NotFoundError('User not found');
   }

   // Avoid
   User.findById(id, (err, user) => {
     if (err) throw err;
     return user;
   });
   ```

#### File Organization

1. **Import order**
   ```javascript
   // Third-party imports
   const express = require('express');
   const mongoose = require('mongoose');

   // Local imports
   const User = require('../models/User');
   const authMiddleware = require('../middleware/auth');
   const { ValidationError } = require('../utils/errors');
   ```

2. **Function organization**
   ```javascript
   // Export at the end
   class UserController {
     constructor() {
       this.userService = new UserService();
     }

     async getProfile(req, res, next) {
       // Implementation
     }

     async updateProfile(req, res, next) {
       // Implementation
     }
   }

   module.exports = UserController;
   ```

### Testing Guidelines

#### Test Structure

1. **Unit Tests**
   ```javascript
   describe('AuthService', () => {
     let authService;
     let mockUserRepository;

     beforeEach(() => {
       mockUserRepository = {
         findByEmail: jest.fn(),
         create: jest.fn()
       };
       authService = new AuthService(mockUserRepository);
     });

     describe('register', () => {
       it('should create a new user successfully', async () => {
         // Arrange
         const userData = {
           username: 'testuser',
           email: 'test@example.com',
           password: 'password123'
         };
         
         mockUserRepository.findByEmail.mockResolvedValue(null);
         mockUserRepository.create.mockResolvedValue({ id: 1, ...userData });

         // Act
         const result = await authService.register(userData);

         // Assert
         expect(result).toHaveProperty('user');
         expect(result).toHaveProperty('token');
         expect(mockUserRepository.create).toHaveBeenCalledWith(
           expect.objectContaining({ email: userData.email })
         );
       });
     });
   });
   ```

2. **Integration Tests**
   ```javascript
   describe('Authentication Endpoints', () => {
     beforeEach(async () => {
       await User.deleteMany({});
     });

     describe('POST /api/auth/register', () => {
       it('should register a new user', async () => {
         const userData = {
           username: 'testuser',
           email: 'test@example.com',
           password: 'password123'
         };

         const response = await request(app)
           .post('/api/auth/register')
           .send(userData)
           .expect(201);

         expect(response.body.success).toBe(true);
         expect(response.body.data.user.email).toBe(userData.email);
       });
     });
   });
   ```

#### Test Coverage

- Aim for at least 80% code coverage
- Focus on testing business logic
- Test both success and error scenarios
- Mock external dependencies

### Documentation Standards

#### API Documentation

1. **Endpoint Documentation**
   ```javascript
   /**
    * @route POST /api/auth/register
    * @description Register a new user
    * @access Public
    * @param {Object} req.body - User registration data
    * @param {string} req.body.username - Username (3-50 characters)
    * @param {string} req.body.email - Valid email address
    * @param {string} req.body.password - Password (minimum 6 characters)
    * @returns {Object} 201 - Success response with user data and token
    * @returns {Object} 400 - Validation error
    * @returns {Object} 409 - Email already exists
    */
   ```

2. **Function Documentation**
   ```javascript
   /**
    * Validates user input for registration
    * @param {Object} userData - User data to validate
    * @param {string} userData.username - Username
    * @param {string} userData.email - Email address
    * @param {string} userData.password - Password
    * @returns {Object} Validation result
    * @throws {ValidationError} When validation fails
    */
   const validateUserRegistration = (userData) => {
     // Implementation
   };
   ```

#### Code Comments

1. **Inline Comments**
   ```javascript
   // Hash password before saving to database
   const hashedPassword = await bcrypt.hash(password, 12);

   // Generate JWT token with user ID
   const token = jwt.sign(
     { userId: user.id },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```

2. **Complex Logic Comments**
   ```javascript
   /**
    * Calculate submission score based on test cases passed,
    * execution time, and memory usage
    */
   const calculateScore = (testCasesPassed, totalTestCases, executionTime, memoryUsed) => {
     // Base score from test cases (0-70 points)
     const baseScore = (testCasesPassed / totalTestCases) * 70;
     
     // Time bonus (0-20 points, inversely proportional to execution time)
     const timeBonus = Math.max(0, 20 - (executionTime / 1000));
     
     // Memory bonus (0-10 points, inversely proportional to memory usage)
     const memoryBonus = Math.max(0, 10 - (memoryUsed / 1000000));
     
     return Math.round(baseScore + timeBonus + memoryBonus);
   };
   ```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. **Run tests**
   ```bash
   npm test
   npm run lint
   ```

3. **Update documentation**
   - Update README if needed
   - Add/update API documentation
   - Update CHANGELOG

### Pull Request Template

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
Fixes #456
```

### Review Process

1. **Automated Checks**
   - All tests must pass
   - Code coverage must meet minimum threshold
   - Linting must pass without errors

2. **Code Review**
   - At least one maintainer review required
   - Address all review comments
   - Ensure no breaking changes

3. **Merge Requirements**
   - Branch must be up to date with develop
   - All checks must pass
   - Approved by required reviewers

## Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
A clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g. Ubuntu 20.04]
- Node.js version: [e.g. 16.14.0]
- MongoDB version: [e.g. 5.0.6]

## Additional Context
Any other context about the problem.
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
A clear description of what you want to happen.

## Problem Statement
Explain the problem this feature would solve.

## Proposed Solution
Describe the solution you'd like.

## Alternative Solutions
Describe alternatives you've considered.

## Additional Context
Any other context or screenshots about the feature request.
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Pre-release**
   - [ ] All tests passing
   - [ ] Documentation updated
   - [ ] CHANGELOG updated
   - [ ] Version bumped

2. **Release**
   - [ ] Create release branch
   - [ ] Tag release
   - [ ] Deploy to staging
   - [ ] Run smoke tests
   - [ ] Deploy to production

3. **Post-release**
   - [ ] Monitor application
   - [ ] Update documentation
   - [ ] Announce release

## Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Discord/Slack**: Real-time chat (if available)
- **Email**: Direct contact for sensitive issues

### Resources

- [Project Documentation](./README.md)
- [API Documentation](./API.md)
- [Development Guide](./DEVELOPMENT.md)
- [Architecture Overview](./ARCHITECTURE.md)

## Recognition

### Contributors

We recognize all contributors:
- GitHub contributors page
- CONTRIBUTORS.md file
- Release notes mentions
- Social media recognition

### Maintainers

Current maintainers:
- @maintainer1 - Project Lead
- @maintainer2 - Backend Developer
- @maintainer3 - DevOps Engineer

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

Thank you for contributing to the Coding Platform Backend! 🚀