const Docker = require('dockerode');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class DockerManager {
  constructor() {
    this.docker = new Docker();
    this.containers = new Map(); 
    this.imageCache = new Set();
    
    this.baseImageNames = {
      python: 'coding-platform-python',
      java: 'coding-platform-java',
      cpp: 'coding-platform-cpp',
      c: 'coding-platform-c',
      javascript: 'coding-platform-javascript'
    };
    
    // Initialize available images
    this.initializeImages();
  }

  async initializeImages() {
    for (const imageName of Object.values(this.baseImageNames)) {
      try {
        await this.ensureImageExists(imageName);
      } catch (error) {
        logger.error(`Failed to initialize image ${imageName}:`, error);
      }
    }
  }

  async ensureImageExists(imageName) {
    if (this.imageCache.has(imageName)) {
      logger.info(`Docker image ${imageName} already exists`);
      return;
    }

    try {
      const images = await this.docker.listImages();
      const imageExists = images.some(image => 
        image.RepoTags && image.RepoTags.includes(`${imageName}:latest`)
      );

      if (imageExists) {
        this.imageCache.add(imageName);
        logger.info(`Docker image ${imageName} already exists`);
        return;
      }

      // Build the image if it doesn't exist
      await this.buildImage(imageName);
      this.imageCache.add(imageName);
    } catch (error) {
      logger.error(`Error checking/building image ${imageName}:`, error);
      throw error;
    }
  }

  async buildImage(imageName) {
    const dockerfilePath = this.getDockerfilePath(imageName);
    
    if (!fs.existsSync(dockerfilePath)) {
      throw new Error(`Dockerfile not found: ${dockerfilePath}`);
    }

    logger.info(`Building Docker image: ${imageName}`);

    const buildContext = path.dirname(dockerfilePath);
    const tar = require('tar-fs');
    
    const stream = await this.docker.buildImage(
      tar.pack(buildContext),
      {
        t: imageName,
        dockerfile: path.basename(dockerfilePath)
      }
    );

    return new Promise((resolve, reject) => {
      this.docker.modem.followProgress(stream, (err, res) => {
        if (err) {
          logger.error(`Failed to build image ${imageName}:`, err);
          reject(err);
        } else {
          logger.info(`Successfully built image: ${imageName}`);
          resolve(res);
        }
      });
    });
  }

  getDockerfilePath(imageName) {
    const languageMap = {
      'coding-platform-python': 'Dockerfile.python',
      'coding-platform-java': 'Dockerfile.java',
      'coding-platform-cpp': 'Dockerfile.cpp',
      'coding-platform-c': 'Dockerfile.c',
      'coding-platform-javascript': 'Dockerfile.javascript'
    };

    const dockerfileName = languageMap[imageName];
    if (!dockerfileName) {
      throw new Error(`Unknown image: ${imageName}`);
    }

    return path.join(__dirname, '..', 'docker', dockerfileName);
  }

  async ensureImagesBuilt() {
    try {
      for (const [language, imageName] of Object.entries(this.baseImageNames)) {
        await this.buildImageIfNotExists(language, imageName);
      }
    } catch (error) {
      logger.error('Error ensuring Docker images are built:', error);
    }
  }

  async buildImageIfNotExists(language, imageName) {
    try {
      // Check if image exists
      const { stdout } = await this.execPromise(`docker images -q ${imageName}`);
      if (stdout.trim()) {
        logger.info(`Docker image ${imageName} already exists`);
        return;
      }

      // Build the image
      const dockerfilePath = path.join(__dirname, '..', 'docker', `Dockerfile.${language}`);
      const contextPath = path.join(__dirname, '..', 'docker');
      
      logger.info(`Building Docker image ${imageName}...`);
      await this.execPromise(`docker build -f ${dockerfilePath} -t ${imageName} ${contextPath}`);
      logger.info(`Docker image ${imageName} built successfully`);
    } catch (error) {
      logger.error(`Error building Docker image ${imageName}:`, error);
      throw error;
    }
  }

  async ensureImage(language) {
    const imageName = `codeexec-${language}:latest`;

    // First check our cache
    if (this.imageCache.has(imageName)) {
      return imageName;
    }

    try {
      // Check if image exists in Docker
      await this.docker.getImage(imageName).inspect();
      this.imageCache.add(imageName);
      logger.info(`Found existing image: ${imageName}`);
      return imageName;
    } catch (error) {
      // Image doesn't exist, try to build it
      logger.info(`Image ${imageName} not found, building...`);
      
      // Clean up any existing failed images first
      try {
        const images = await this.docker.listImages();
        const danglingImages = images.filter(img => 
          img.RepoTags === null || 
          (img.RepoTags && img.RepoTags.some(tag => tag.includes(imageName.split(':')[0])))
        );
        
        for (const img of danglingImages) {
          try {
            await this.docker.getImage(img.Id).remove({ force: true });
            logger.info(`Removed dangling image: ${img.Id}`);
          } catch (e) {
            // Ignore removal errors
          }
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      
      await this.buildImage(language);
      
      // Wait a moment for the build to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verify the image was built successfully
      try {
        await this.docker.getImage(imageName).inspect();
        this.imageCache.add(imageName);
        logger.info(`Image ${imageName} verified and cached`);
        return imageName;
      } catch (verifyError) {
        logger.error(`Failed to verify built image ${imageName}:`, verifyError);
        
        // Try to clean up the failed build
        try {
          const images = await this.docker.listImages();
          const failedImages = images.filter(img => 
            img.RepoTags === null || 
            (img.RepoTags && img.RepoTags.some(tag => tag.includes('<none>')))
          );
          
          for (const img of failedImages) {
            try {
              await this.docker.getImage(img.Id).remove({ force: true });
            } catch (e) {
              // Ignore cleanup errors
            }
          }
        } catch (e) {
          // Ignore cleanup errors
        }
        
        throw new Error(`Image build verification failed for ${language}`);
      }
    }
  }

  async createContainer(language, template, userCode, input, limits = {}) {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      const config = this.getLanguageConfig(language);
      if (!config) {
        throw new Error(`Unsupported language: ${language}`);
      }

      await this.ensureImageExists(config.image);

      // Use writable directories for Java compilation
      const workingDir = language === 'java' ? '/app/code' : '/app';
      
      const container = await this.docker.createContainer({
        Image: config.image,
        WorkingDir: workingDir,
        Cmd: ['sleep', '30'],
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: false,
        NetworkMode: 'none',
        User: 'root',
        Memory: (limits.memory || 256) * 1024 * 1024,
        CpuQuota: 50000,
        CpuPeriod: 100000,
        PidsLimit: 32,
        ReadonlyRootfs: false, // Allow writing for Java compilation
        Tmpfs: {
          '/tmp': 'rw,noexec,nosuid,size=50m',
          '/var/tmp': 'rw,noexec,nosuid,size=50m'
        },
        Env: [
          'TERM=xterm',
          'LANG=C.UTF-8',
          'LC_ALL=C.UTF-8'
        ]
      });

      await container.start();

      // Determine filename and target path
      let filename, targetPath;
      if (limits && limits.filename) {
        filename = limits.filename;
      } else {
        if (language === 'java') {
          filename = 'Main.java';
        } else if (language === 'cpp') {
          filename = 'solution.cpp';
        } else if (language === 'python') {
          filename = 'solution.py';
        } else if (language === 'javascript') {
          filename = 'solution.js';
        } else if (language === 'c') {
          filename = 'solution.c';
        } else {
          filename = 'solution.txt';
        }
      }
      // For Java driver code, always write to /app/code
      targetPath = (language === 'java') ? '/app/code' : '/app';

      // Write code and input files
      await this.writeFileToContainer(container, filename, userCode, targetPath);
      if (input) {
        await this.writeFileToContainer(container, 'input.txt', input, targetPath);
      }

      this.containers.set(executionId, {
        container,
        startTime,
        language,
        codeFileName: filename,
        limits
      });

      logger.info(`Container created for execution ${executionId}`, {
        language,
        containerId: container.id,
        workingDir
      });

      return { executionId };
    } catch (error) {
      logger.error(`Failed to create container for execution ${executionId}:`, error);
      throw new Error(`Container creation failed: ${error.message}`);
    }
  }

  async executeContainer(executionId, timeout = 5000) {
    const execution = this.containers.get(executionId);
    if (!execution) {
      throw new Error('Execution not found');
    }

    const { container, language, codeFileName, limits } = execution;
    const config = this.getLanguageConfig(language);
    
    try {
      let stdout = '';
      let stderr = '';
      let exitCode = 0;
      let killed = false;
      let executionTime = 0;

      const startTime = Date.now();

      // Compile if needed
      if (config.compileCommand) {
        // For Java, always compile Main.java
        const compileTarget = language === 'java' ? 'Main.java' : codeFileName;
        const compileResult = await this.runCommand(container, config.compileCommand.concat([compileTarget]), timeout / 2);
        if (compileResult.exitCode !== 0) {
          return {
            stdout: compileResult.stdout,
            stderr: compileResult.stderr,
            exitCode: compileResult.exitCode,
            executionTime: Date.now() - startTime,
            killed: false,
            stats: { memoryUsed: 0 }
          };
        }
      }

      // Execute
      let executeCommand;
      if (language === 'python') {
        executeCommand = ['python3', '-u', 'solution.py'];
      } else if (language === 'javascript') {
        executeCommand = ['node', codeFileName];
      } else if (language === 'java') {
        executeCommand = config.executeCommand.concat(['Main']);
      } else if (language === 'cpp' || language === 'c') {
        executeCommand = config.executeCommand;
      } else {
        executeCommand = config.executeCommand.concat([codeFileName.replace(/\.[^/.]+$/, "")]);
      }
      const result = await this.runCommand(container, executeCommand, timeout);
      
      executionTime = Date.now() - startTime;

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode,
        executionTime,
        killed: result.killed,
        stats: { memoryUsed: result.memoryUsed || 0 }
      };

    } catch (error) {
      logger.error(`Execution error for ${executionId}:`, error);
      throw error;
    } finally {
      await this.cleanup(executionId);
    }
  }

  async runCommand(container, command, timeout) {
    return new Promise(async (resolve, reject) => {
      try {
        const exec = await container.exec({
          Cmd: command,
          AttachStdout: true,
          AttachStderr: true,
          AttachStdin: false,
          Tty: false
        });

        const stream = await exec.start({ hijack: true, stdin: false });
        
        let stdout = '';
        let stderr = '';
        let killed = false;

        const timeoutId = setTimeout(async () => {
          killed = true;
          try {
            await container.kill();
          } catch (e) {
            // Container might already be stopped
          }
        }, timeout);

        container.modem.demuxStream(stream, 
          process.stdout, 
          process.stderr
        );

        // Capture output
        const chunks = [];
        stream.on('data', (chunk) => {
          chunks.push(chunk);
        });

        stream.on('end', async () => {
          clearTimeout(timeoutId);
          
          try {
            const inspect = await exec.inspect();
            const exitCode = inspect.ExitCode;

            // Parse stdout/stderr from chunks
            let allData = Buffer.concat(chunks);
            stdout = allData.toString();
            
            resolve({
              stdout,
              stderr,
              exitCode: killed ? 124 : exitCode,
              killed,
              memoryUsed: 0
            });
          } catch (error) {
            reject(error);
          }
        });

        stream.on('error', (error) => {
          clearTimeout(timeoutId);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  async writeFileToContainer(container, fileName, content, targetPath = '/app') {
    const tarStream = require('tar-stream');
    const pack = tarStream.pack();

    pack.entry({ name: fileName }, content);
    pack.finalize();

    await container.putArchive(pack, { path: targetPath });
  }

  getLanguageConfig(language) {
    const configs = {
      python: {
        image: 'coding-platform-python',
        extension: '.py',
        compileCommand: null,
        executeCommand: ['python3', '-u'],
        timeout: 5000
      },
      java: {
        image: 'coding-platform-java',
        extension: '.java',
        compileCommand: ['javac', '-cp', '/app/code'],
        executeCommand: ['java', '-cp', '/app/code'],
        timeout: 8000
      },
      cpp: {
        image: 'coding-platform-cpp',
        extension: '.cpp',
        compileCommand: ['g++', '-o', 'solution', '-std=c++17', '-O2'],
        executeCommand: ['./solution'],
        timeout: 5000
      },
      c: {
        image: 'coding-platform-c',
        extension: '.c',
        compileCommand: ['gcc', '-o', 'solution', '-std=c17', '-O2'],
        executeCommand: ['./solution'],
        timeout: 5000
      },
      javascript: {
        image: 'coding-platform-javascript',
        extension: '.js',
        compileCommand: null,
        executeCommand: ['node'],
        timeout: 5000
      }
    };

    return configs[language.toLowerCase()];
  }

  getCodeFileName(language) {
    const config = this.getLanguageConfig(language);
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const fileNames = {
      python: 'solution.py',
      java: 'Main.java',
      cpp: 'solution.cpp',
      c: 'solution.c',
      javascript: 'solution.js'
    };

    return fileNames[language.toLowerCase()] || `solution${config.extension}`;
  }

  async cleanup(executionId) {
    const execution = this.containers.get(executionId);
    if (!execution) {
      return;
    }

    try {
      const { container } = execution;
      await container.remove({ force: true });
      this.containers.delete(executionId);
      logger.info(`Cleaned up container for execution ${executionId}`);
    } catch (error) {
      logger.warn(`Failed to cleanup container for execution ${executionId}:`, error);
    }
  }

  async cleanupAll() {
    const cleanupPromises = Array.from(this.containers.keys()).map(id => this.cleanup(id));
    await Promise.allSettled(cleanupPromises);
  }

  getStats() {
    return {
      activeContainers: this.containers.size,
      cachedImages: this.imageCache.size
    };
  }

  async execPromise(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  async execWithTimeout(command, timeout) {
    return new Promise((resolve, reject) => {
      const process = exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({
            stdout: stdout || '',
            stderr: stderr || error.message,
            exitCode: error.code || 1,
            killed: error.killed || false
          });
        } else {
          resolve({
            stdout: stdout || '',
            stderr: stderr || '',
            exitCode: 0,
            killed: false
          });
        }
      });

      const timeoutId = setTimeout(() => {
        process.kill('SIGKILL');
        resolve({
          stdout: '',
          stderr: 'Time Limit Exceeded',
          exitCode: 124,
          killed: true
        });
      }, timeout);

      process.on('exit', () => {
        clearTimeout(timeoutId);
      });
    });
  }

  // Cleanup old containers periodically
  startCleanupScheduler() {
    setInterval(() => {
      this.cleanupOldContainers();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  async cleanupOldContainers() {
    const maxAge = 10 * 60 * 1000; // 10 minutes
    const now = Date.now();

    for (const [executionId, containerInfo] of this.containers.entries()) {
      if (now - containerInfo.created > maxAge) {
        logger.info(`Cleaning up old container: ${executionId}`);
        await this.cleanupContainer(executionId);
      }
    }
  }
}

module.exports = new DockerManager();