module.exports = {
  EXECUTION_LIMITS: {
    python: {
      timeLimit: 30000, // 30 seconds
      memoryLimit: 256, // 256 MB
      outputLimit: 1048576 // 1 MB
    },
    java: {
      timeLimit: 45000, // 45 seconds (compilation + execution)
      memoryLimit: 512, // 512 MB
      outputLimit: 1048576 // 1 MB
    },
    cpp: {
      timeLimit: 30000, // 30 seconds
      memoryLimit: 256, // 256 MB
      outputLimit: 1048576 // 1 MB
    },
    javascript: {
      timeLimit: 30000, // 30 seconds
      memoryLimit: 256, // 256 MB
      outputLimit: 1048576 // 1 MB
    },
    c: {
      timeLimit: 30000, // 30 seconds
      memoryLimit: 256, // 256 MB
      outputLimit: 1048576 // 1 MB
    }
  },

  VERDICTS: {
    ACCEPTED: 'accepted',
    WRONG_ANSWER: 'wrong_answer',
    TIME_LIMIT_EXCEEDED: 'time_limit_exceeded',
    MEMORY_LIMIT_EXCEEDED: 'memory_limit_exceeded',
    RUNTIME_ERROR: 'runtime_error',
    COMPILE_ERROR: 'compile_error',
    SYSTEM_ERROR: 'system_error',
    PENDING: 'pending',
    RUNNING: 'running'
  },

  QUEUE_PRIORITIES: {
    HIGH: 10,
    NORMAL: 5,
    LOW: 1
  }
};
