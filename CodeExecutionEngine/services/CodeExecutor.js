const DockerManager = require('./DockerManager');
const ComplexityAnalyzer = require('./ComplexityAnalyzer');
const SecurityValidator = require('./SecurityValidator');
const CodeSubmission = require('../models/CodeSubmission');
const ExecutionResult = require('../models/ExecutionResult');
const Problem = require('../models/Problem');
const logger = require('../utils/logger');

class CodeExecutor {
  constructor() {
    this.executionQueue = [];
    this.isProcessing = false;
    this.maxConcurrentExecutions = 5;
    this.currentExecutions = 0;
  }

  getLanguageTimeout(language, baseTimeout) {
    const languageMultipliers = {
      'java': 3.0,        // Java needs more time for JVM startup
      'python': 1.5,      // Python has some startup overhead
      'javascript': 1.2,  // Node.js has minimal startup time
      'cpp': 1.0,         // Compiled C++ runs fast
      'c': 1.0           // Compiled C runs fast
    };

    const multiplier = languageMultipliers[language] || 1.0;
    return Math.max(baseTimeout * multiplier, language === 'java' ? 5000 : baseTimeout);
  }

  async submitCode(userId, problemId, code, language) {
    try {
      // Validate input
      // const validationResult = await SecurityValidator.validateCode(code, language);
      // if (!validationResult.isValid) {
      //   throw new Error(`Security violation: ${validationResult.errors.join(', ')}`);
      // }

      // Create submission record
      const submission = new CodeSubmission({
        user: userId,
        problem: problemId,
        code,
        language,
        status: 'pending'
      });

      await submission.save();

      // Add to execution queue
      this.addToQueue(submission);

      return {
        submissionId: submission._id,
        status: 'queued',
        message: 'Code submitted successfully and queued for execution'
      };
    } catch (error) {
      logger.error('Error submitting code:', error);
      throw error;
    }
  }

  addToQueue(submission) {
    this.executionQueue.push(submission);
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.currentExecutions >= this.maxConcurrentExecutions) {
      return;
    }

    if (this.executionQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    this.currentExecutions++;

    const submission = this.executionQueue.shift();

    try {
      await this.executeSubmission(submission);
    } catch (error) {
      logger.error('Error executing submission:', error);
      await this.updateSubmissionStatus(submission._id, 'system_error', error.message);
    } finally {
      this.currentExecutions--;
      this.isProcessing = false;

      // Process next item in queue
      setImmediate(() => this.processQueue());
    }
  }

  async executeSubmission(submission) {
    try {
      await this.updateSubmissionStatus(submission._id, 'running');

      // Get problem with test cases embedded in the document
      const problem = await Problem.findById(submission.problem);
      if (!problem) {
        throw new Error('Problem not found');
      }

      // Get test cases from the problem document directly
      const testCases = problem.testCases || [];
      if (testCases.length === 0) {
        throw new Error('No test cases found for this problem');
      }

      // Execute against all test cases
      const results = await this.runTestCases(submission, testCases, problem);

      // Analyze complexity
      const complexityAnalysis = await ComplexityAnalyzer.analyze(submission.code, submission.language);

      // Calculate overall result
      const overallResult = this.calculateOverallResult(results);

      // Update submission with results
      await CodeSubmission.findByIdAndUpdate(submission._id, {
        executionResults: results,
        overallResult,
        complexityAnalysis,
        status: overallResult.verdict,
        executedAt: new Date(),
        completedAt: new Date()
      });

      logger.info(`Execution completed for submission ${submission._id}: ${overallResult.verdict}`);

    } catch (error) {
      logger.error(`Error executing submission ${submission._id}:`, error);
      await this.updateSubmissionStatus(submission._id, 'system_error', error.message);
    }
  }

  async runTestCases(submission, testCases, problem) {
    console.log('=== RUNNING TEST CASES ===');
    console.log('Test Cases count:', testCases.length);
    
    const functionSignature = problem.functionSignatures?.[submission.language];
    
    // Always try driver code approach first if we have function signature and test cases
    if (functionSignature && testCases && testCases.length > 0) {
      console.log('Using driver code approach for submission...');
      try {
        const result = await this.runTestCasesWithDriver(submission, testCases, problem);
        console.log('Driver code approach successful');
        return result;
      } catch (error) {
        console.error('Driver code approach failed:', error);
        console.log('Falling back to individual test case execution...');
        // Fall back to individual test case execution
        return await this.runTestCasesIndividually(submission, testCases, problem);
      }
    }
    
    // Fallback to individual test case execution
    console.log('Using individual test case execution (no function signature available)');
    return await this.runTestCasesIndividually(submission, testCases, problem);
  }

  async runTestCasesWithDriver(submission, testCases, problem) {
    console.log('Running test cases with driver code approach');
    
    try {
      const driverCodeGenerator = require('../src/services/driverCodeGenerator');
      
      const plainTestCases = testCases.map(tc => ({
        input: tc.input,
        output: tc.output,
        isHidden: tc.isHidden,
        _id: tc._id,
      }));
      
      console.log('Generating driver code for submission...');
      const driverCode = driverCodeGenerator.generate(
        submission.language,
        problem.functionSignatures[submission.language],
        plainTestCases,
        submission.code,
        problem.description || ''
      );
      
      console.log('Driver code generated successfully, executing...');
      
      // Execute the driver code
      const DockerManager = require('./DockerManager');
      const limits = {
        time: problem.timeLimit || 5000,
        memory: problem.memoryLimit || 256,
        language: submission.language
      };

      const { executionId } = await DockerManager.createContainer(
        submission.language,
        '', // No template needed - driver code is complete
        driverCode,
        '', // No additional input needed
        limits
      );

      const result = await DockerManager.executeContainer(executionId, limits.time);
      
      console.log('Driver execution completed');
      console.log('Driver output:', result.stdout);
      console.log('Driver error:', result.stderr);
      
      if (result.stderr && result.stderr.trim()) {
        console.error('Driver execution error:', result.stderr);
        throw new Error(`Driver execution failed: ${result.stderr}`);
      }
      
      // Parse the output to extract test results
      const testResults = this.parseDriverOutput(result.stdout, plainTestCases);
      
      console.log('Parsed test results:', testResults);
      
      return testResults;
      
    } catch (error) {
      console.error('Error in driver code execution:', error);
      throw error;
    }
  }

  parseDriverOutput(output, testCases) {
    const results = [];
    
    if (!output || !output.trim()) {
      console.warn('No output from driver execution');
      // Return failed results for all test cases
      return testCases.map(tc => ({
        testCase: tc._id,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: '',
        status: 'failed',
        errorMessage: 'No output generated',
        executionTime: 0,
        memoryUsed: 0
      }));
    }
    
    const lines = output.split('\n');
    console.log('Parsing driver output lines:', lines);
    
    testCases.forEach((testCase, index) => {
      const testNumber = index + 1;
      const testPattern = new RegExp(`Test ${testNumber} - Output: (.+?), Expected: (.+)`);
      
      let found = false;
      for (const line of lines) {
        const match = line.match(testPattern);
        if (match) {
          const actualOutput = match[1].trim();
          const expectedOutput = testCase.output;
          
          // For complex outputs like arrays, we need to normalize comparison
          const status = this.compareOutputs(actualOutput, expectedOutput) ? 'passed' : 'failed';
          
          results.push({
            testCase: testCase._id,
            input: testCase.input,
            expectedOutput: expectedOutput,
            actualOutput: actualOutput,
            status: status,
            errorMessage: status === 'failed' ? 'Wrong Answer' : null,
            executionTime: 0,
            memoryUsed: 0
          });
          
          found = true;
          break;
        }
      }
      
      if (!found) {
        console.warn(`No output found for test case ${testNumber}`);
        results.push({
          testCase: testCase._id,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          status: 'failed',
          errorMessage: 'No output found',
          executionTime: 0,
          memoryUsed: 0
        });
      }
    });
    
    return results;
  }

  compareOutputs(actual, expected) {
    try {
      // Remove extra whitespace and normalize
      const normalizedActual = actual.trim().replace(/\s+/g, ' ');
      const normalizedExpected = expected.trim().replace(/\s+/g, ' ');
      
      // Direct string comparison first
      if (normalizedActual === normalizedExpected) {
        return true;
      }
      
      // Try to parse as JSON and compare
      try {
        const parsedActual = JSON.parse(normalizedActual);
        const parsedExpected = JSON.parse(normalizedExpected);
        
        return JSON.stringify(parsedActual) === JSON.stringify(parsedExpected);
      } catch (e) {
        // If JSON parsing fails, fall back to string comparison
        return normalizedActual === normalizedExpected;
      }
    } catch (error) {
      console.warn('Error comparing outputs:', error);
      return false;
    }
  }

  async runTestCasesIndividually(submission, testCases, problem) {
    // Instead of running individual test cases, use driver code generation
    const driverCodeGenerator = require('../src/services/driverCodeGenerator');
    const DockerManager = require('./DockerManager');
    const logger = require('../utils/logger');
    
    const results = [];
    
    try {
      // Get function signature for the language
      const functionSignature = problem.functionSignatures?.get(submission.language.toLowerCase());
      
      if (functionSignature && testCases && testCases.length > 0) {
        logger.info('Using driver code generation for test execution');
        
        // Convert test cases to plain objects
        const plainTestCases = testCases.map(tc => ({
          input: tc.input,
          output: tc.output,
          isHidden: tc.isHidden,
          _id: tc._id
        }));
        
        // Generate driver code
        const driverCode = driverCodeGenerator.generate(
          submission.language,
          functionSignature,
          plainTestCases,
          submission.code,
          problem.description || ''
        );
        
        // Execute the driver code
        const limits = {
          time: problem.timeLimit || 2000,
          memory: problem.memoryLimit || 256,
          language: submission.language
        };
        
        const adjustedTimeout = this.getLanguageTimeout(submission.language, limits.time);
        
        const { executionId } = await DockerManager.createContainer(
          submission.language,
          '', // No template needed - driver code is complete
          driverCode,
          '', // No input needed - driver code handles all test cases
          { ...limits, time: adjustedTimeout }
        );
        
        const executionResult = await DockerManager.executeContainer(executionId, adjustedTimeout);
        
        // Parse the output to extract individual test results
        const output = executionResult.stdout || '';
        const lines = output.split('\n');
        
        // Parse test results from output
        testCases.forEach((testCase, index) => {
          const testLine = lines.find(line => line.includes(`Test ${index + 1} - Output:`));
          
          if (testLine) {
            // Extract actual output from the test line
            const outputMatch = testLine.match(/Test \d+ - Output: (.+?), Expected: (.+)$/);
            if (outputMatch) {
              const actualOutput = outputMatch[1];
              const expectedOutput = testCase.output;
              
              // Compare outputs with improved logic
              let status = 'passed';
              let errorMessage = '';
              
              try {
                // Normalize and compare outputs
                const isMatch = this.compareOutputsNormalized(actualOutput, expectedOutput);
                
                if (!isMatch) {
                  status = 'failed';
                  errorMessage = 'Wrong Answer';
                }
              } catch (e) {
                status = 'failed';
                errorMessage = 'Output comparison failed';
              }
              
              results.push({
                testCase: testCase._id || `test_${index}`,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: actualOutput,
                status: status,
                executionTime: executionResult.executionTime || 0,
                memoryUsed: executionResult.stats?.memoryUsed || 0,
                errorMessage: status === 'failed' ? errorMessage : ''
              });
            } else {
              results.push({
                testCase: testCase._id || `test_${index}`,
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: '',
                status: 'failed',
                executionTime: 0,
                memoryUsed: 0,
                errorMessage: 'Could not parse test output'
              });
            }
          } else {
            results.push({
              testCase: testCase._id || `test_${index}`,
              input: testCase.input,
              expectedOutput: testCase.output,
              actualOutput: '',
              status: 'failed',
              executionTime: 0,
              memoryUsed: 0,
              errorMessage: 'Test output not found'
            });
          }
        });
        
        // If we have system errors, mark all tests as failed
        if (executionResult.killed || executionResult.exitCode !== 0) {
          results.forEach(result => {
            if (result.status === 'passed') {
              result.status = 'failed';
              result.errorMessage = executionResult.killed ? 'Time Limit Exceeded' : 'Runtime Error';
            }
          });
        }
        
      } else {
        // Fallback to individual test execution if no function signature
        logger.info('Using individual test case execution (fallback)');
        return this.runIndividualTestCasesFallback(submission, testCases, problem);
      }
    } catch (error) {
      logger.error('Error in driver code execution:', error);
      // Mark all tests as failed
      testCases.forEach((testCase, index) => {
        results.push({
          testCase: testCase._id || `test_${index}`,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          status: 'system_error',
          executionTime: 0,
          memoryUsed: 0,
          errorMessage: error.message
        });
      });
    }
    
    return results;
  }

  compareOutputsNormalized(actual, expected) {
    try {
      // Special handling for N-Queens and similar problems (array of arrays of strings)
      // Try to parse both as JSON
      let parsedActual, parsedExpected;
      try {
        parsedActual = JSON.parse(actual);
        parsedExpected = JSON.parse(expected);
      } catch (jsonError) {
        // If parsing fails, try to fix quotes and parse again
        try {
          parsedActual = JSON.parse(actual.replace(/'/g, '"'));
          parsedExpected = JSON.parse(expected.replace(/'/g, '"'));
        } catch (e) {
          // Fallback to string comparison
          return actual.trim() === expected.trim();
        }
      }

      // If both are arrays, do deep comparison
      if (Array.isArray(parsedActual) && Array.isArray(parsedExpected)) {
        return this.deepEqual(parsedActual, parsedExpected);
      }

      // If not arrays, fallback to string comparison
      return actual.trim() === expected.trim();
    } catch (error) {
      // Fallback to string comparison
      return actual.trim() === expected.trim();
    }
  }

  deepEqual(a, b) {
    // Deep comparison for arrays/objects
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    if (typeof a === 'object' && typeof b === 'object' && a && b) {
      const aKeys = Object.keys(a);
      const bKeys = Object.keys(b);
      if (aKeys.length !== bKeys.length) return false;
      for (const key of aKeys) {
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      return true;
    }
    // For strings, ignore whitespace differences
    if (typeof a === 'string' && typeof b === 'string') {
      return a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
    }
    return false;
  }

  async runIndividualTestCasesFallback(submission, testCases, problem) {
    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await this.executeTestCase(submission, testCase, problem);
        results.push(result);
      } catch (error) {
        results.push({
          testCase: testCase._id || `test_${i}`,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          status: 'system_error',
          executionTime: 0,
          memoryUsed: 0,
          errorMessage: error.message
        });
      }
    }
    
    return results;
  }

  async executeTestCase(submission, testCase, problem) {
    const baseLimits = {
      time: problem.timeLimit || 2000,
      memory: problem.memoryLimit || 256
    };

    const adjustedTimeout = this.getLanguageTimeout(submission.language, baseLimits.time);
    
    const limits = {
      ...baseLimits,
      time: adjustedTimeout
    };

    try {
      logger.info('=== EXECUTING TEST CASE ===');
      logger.info('Submission ID:', submission._id);
      logger.info('Language:', submission.language);
      logger.info('Test Case Input:', testCase.input);
      logger.info('Expected Output:', testCase.output);

      // This fallback method is only used when driver code generation fails
      // We'll execute the user code directly with the test input
      const DockerManager = require('./DockerManager');
      
      const { executionId } = await DockerManager.createContainer(
        submission.language,
        '',
        submission.code,
        testCase.input,
        limits
      );
      
      const executionResult = await DockerManager.executeContainer(executionId, adjustedTimeout);
      
      const actualOutput = (executionResult.stdout || '').trim();
      const expectedOutput = testCase.output.trim();

      let status = 'passed';
      let errorMessage = '';

      if (executionResult.killed) {
        status = 'time_limit_exceeded';
        errorMessage = 'Time Limit Exceeded';
      } else if (executionResult.exitCode !== 0) {
        status = 'runtime_error';
        errorMessage = executionResult.stderr || 'Runtime Error';
      } else if (!this.compareOutputsNormalized(actualOutput, expectedOutput)) {
        status = 'wrong_answer';
        errorMessage = 'Wrong Answer';
      }

      return {
        testCase: testCase._id,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: actualOutput,
        status: status,
        executionTime: executionResult.executionTime || 0,
        memoryUsed: executionResult.stats?.memoryUsed || 0,
        errorMessage: errorMessage
      };
      
    } catch (error) {
      logger.error('Error executing test case:', error);
      return {
        testCase: testCase._id,
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: '',
        status: 'system_error',
        executionTime: 0,
        memoryUsed: 0,
        errorMessage: error.message
      };
    }
  }

  calculateOverallResult(results) {
    const totalTests = results.length;
    const passedTests = results.filter(r => r.status === 'passed').length;
    const failedTests = results.filter(r => r.status === 'failed').length;
    const totalExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0);
    const maxMemoryUsed = Math.max(...results.map(r => r.memoryUsed));

    let verdict = 'accepted';

    if (results.some(r => r.status === 'tle')) {
      verdict = 'time_limit_exceeded';
    } else if (results.some(r => r.status === 'mle')) {
      verdict = 'memory_limit_exceeded';
    } else if (results.some(r => r.status === 'rte')) {
      verdict = 'runtime_error';
    } else if (results.some(r => r.status === 'ce')) {
      verdict = 'compile_error';
    } else if (failedTests > 0) {
      verdict = 'wrong_answer';
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      totalExecutionTime,
      maxMemoryUsed,
      verdict
    };
  }

  async updateSubmissionStatus(submissionId, status, errorMessage = '') {
    const updateData = { status };
    if (errorMessage) {
      updateData.compilationOutput = errorMessage;
    }

    await CodeSubmission.findByIdAndUpdate(submissionId, updateData);
  }

  async getSubmissionStatus(submissionId) {
    const submission = await CodeSubmission.findById(submissionId)
      .populate('user', 'name email')
      .populate('problem', 'title')
      .lean();

    if (!submission) {
      throw new Error('Submission not found');
    }

    return submission;
  }

  async getSubmissionResults(submissionId) {
    const submission = await CodeSubmission.findById(submissionId)
      .populate('executionResults.testCase')
      .populate('user', 'name email')
      .populate('problem', 'title')
      .lean();

    if (!submission) {
      throw new Error('Submission not found');
    }

    return {
      submission,
      canViewDetails: true // Add permission logic here
    };
  }

  async getSystemStats() {
    try {
      // Get recent submission statistics
      const recentSubmissions = await CodeSubmission.find({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }).lean();

      const statusCounts = recentSubmissions.reduce((acc, sub) => {
        acc[sub.status] = (acc[sub.status] || 0) + 1;
        return acc;
      }, {});

      const languageCounts = recentSubmissions.reduce((acc, sub) => {
        acc[sub.language] = (acc[sub.language] || 0) + 1;
        return acc;
      }, {});

      return {
        queue: {
          currentQueueLength: this.executionQueue.length,
          isProcessing: this.isProcessing,
          currentExecutions: this.currentExecutions,
          maxConcurrentExecutions: this.maxConcurrentExecutions
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        },
        statistics: {
          totalSubmissions24h: recentSubmissions.length,
          statusBreakdown: statusCounts,
          languageBreakdown: languageCounts,
          averageExecutionTime: recentSubmissions.length > 0 
            ? recentSubmissions.reduce((sum, sub) => sum + (sub.overallResult?.totalExecutionTime || 0), 0) / recentSubmissions.length
            : 0
        },
        timestamp: new Date()
      };
    } catch (error) {
      logger.error('Error getting system stats:', error);
      return {
        queue: {
          currentQueueLength: this.executionQueue.length,
          isProcessing: this.isProcessing,
          currentExecutions: this.currentExecutions,
          maxConcurrentExecutions: this.maxConcurrentExecutions
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        },
        statistics: {
          error: 'Failed to retrieve submission statistics'
        },
        timestamp: new Date()
      };
    }
  }
}

module.exports = new CodeExecutor();
