const CodeExecutor = require('../../services/CodeExecutor');
const mongoose = require('mongoose');
const testSetup = require('../setup');

// Mock dependencies
jest.mock('../../services/DockerManager', () => {
  return require('../__mocks__/DockerManager');
});

jest.mock('../../models/CodeSubmission', () => {
  const mockSave = jest.fn().mockResolvedValue({ _id: 'mock_id', status: 'pending' });
  const mockFindByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'mock_id' });
  const mockFindById = jest.fn().mockResolvedValue({ _id: 'mock_id' });
  
  const MockConstructor = jest.fn().mockImplementation((data) => ({
    ...data,
    _id: 'mock_id',
    save: mockSave
  }));
  
  // Add static methods
  MockConstructor.findByIdAndUpdate = mockFindByIdAndUpdate;
  MockConstructor.findById = mockFindById;
  
  return MockConstructor;
});

jest.mock('../../models/ExecutionResult', () => {
  const mockSave = jest.fn().mockResolvedValue(true);
  
  return jest.fn().mockImplementation((data) => ({
    ...data,
    save: mockSave
  }));
});

jest.mock('../../models/TestCase', () => {
  return {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([])
    })
  };
});

describe('CodeExecutor', () => {
  let codeExecutor;

  beforeAll(async () => {
    await testSetup.setup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  beforeEach(async () => {
    await testSetup.clearDatabase();
    codeExecutor = CodeExecutor;
    // Mock the addToQueue method to prevent automatic queue processing
    codeExecutor.addToQueue = jest.fn();
  });

  describe('submitCode', () => {
    it('should submit valid code successfully', async () => {
      const validUserId = new mongoose.Types.ObjectId();
      const validProblemId = new mongoose.Types.ObjectId();
      
      const result = await codeExecutor.submitCode(
        validUserId.toString(),
        validProblemId.toString(),
        'print("Hello World")',
        'python'
      );
      
      expect(result).toHaveProperty('submissionId');
      expect(result.status).toBe('queued');
    });

    it('should reject malicious code', async () => {
      const validUserId = new mongoose.Types.ObjectId();
      const validProblemId = new mongoose.Types.ObjectId();
      
      await expect(codeExecutor.submitCode(
        validUserId.toString(),
        validProblemId.toString(),
        'import subprocess; subprocess.call(["rm", "-rf", "/"])',
        'python'
      )).rejects.toThrow('Security violation');
    });
  });

  describe('executeTestCase', () => {
    it('should execute simple Python code correctly', async () => {
      const submission = {
        code: 'print("Hello World")',
        language: 'python',
        _id: new mongoose.Types.ObjectId()
      };

      const testCase = {
        input: '',
        expectedOutput: 'Hello World\n',
        timeLimit: 2000,
        memoryLimit: 256,
        _id: new mongoose.Types.ObjectId()
      };

      const result = await codeExecutor.executeTestCase(submission, testCase);
      
      expect(result.status).toBe('passed');
      expect(result.actualOutput.trim()).toBe('Hello World');
    });

    it('should handle timeout correctly', async () => {
      const submission = {
        code: 'while True: pass',
        language: 'python',
        _id: new mongoose.Types.ObjectId()
      };

      const testCase = {
        input: '',
        expectedOutput: '',
        timeLimit: 1000,
        memoryLimit: 256,
        _id: new mongoose.Types.ObjectId()
      };

      const result = await codeExecutor.executeTestCase(submission, testCase);
      
      expect(result.status).toBe('tle');
    });
  });
});
