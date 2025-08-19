// Mock implementation of DockerManager for testing
const MockDockerManager = {
  containers: new Map(),
  images: new Map(),

  async ensureImage(language) {
    return `codeexec-${language}:latest`;
  },

  async executeCode(language, code, input, limits) {
    // Simulate different execution scenarios based on code content
    if (code.includes('while True:') || code.includes('infinite loop')) {
      throw new Error('TIMEOUT');
    }

    if (code.includes('print("Hello World")')) {
      return {
        output: 'Hello World\n',
        exitCode: 0,
        executionTime: 100,
        memoryUsed: 50
      };
    }

    if (code.includes('error') || code.includes('throw')) {
      return {
        output: 'Runtime Error\n',
        exitCode: 1,
        executionTime: 50,
        memoryUsed: 30
      };
    }

    // Default successful execution
    return {
      output: input || '',
      exitCode: 0,
      executionTime: 50,
      memoryUsed: 30
    };
  },

  async createContainer(language, code, input, limits) {
    const containerId = `mock-container-${Date.now()}`;
    this.containers.set(containerId, { language, code, input, limits });
    return {
      executionId: containerId,
      container: {
        id: containerId,
        start: jest.fn().mockResolvedValue(true),
        wait: jest.fn().mockResolvedValue({ StatusCode: 0 }),
        logs: jest.fn().mockResolvedValue('Mock output'),
        remove: jest.fn().mockResolvedValue(true)
      }
    };
  },

  async executeContainer(executionId, timeLimit) {
    const containerInfo = this.containers.get(executionId);
    if (!containerInfo) {
      throw new Error('Container not found');
    }

    const { code } = containerInfo;

    // Simulate execution based on code content
    if (code.includes('while True:') || code.includes('infinite loop')) {
      return {
        executionId,
        stdout: '',
        stderr: '',
        exitCode: 124, // timeout exit code
        killed: true,
        stats: { memoryUsed: 30 },
        executionTime: timeLimit + 100
      };
    }

    if (code.includes('print("Hello World")')) {
      return {
        executionId,
        stdout: 'Hello World\n',
        stderr: '',
        exitCode: 0,
        killed: false,
        stats: { memoryUsed: 50 },
        executionTime: 100
      };
    }

    // Default success
    return {
      executionId,
      stdout: '',
      stderr: '',
      exitCode: 0,
      killed: false,
      stats: { memoryUsed: 30 },
      executionTime: 50
    };
  },

  async cleanup(containerId) {
    this.containers.delete(containerId);
  },

  async buildImage(language) {
    this.images.set(`codeexec-${language}:latest`, true);
    return true;
  }
};

module.exports = MockDockerManager;
