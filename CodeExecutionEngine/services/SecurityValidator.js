const logger = require('../utils/logger');

class SecurityValidator {
  constructor() {
    this.dangerousPatterns = {
      python: [
        /import\s+subprocess/i,
        /import\s+socket/i,
        /import\s+urllib/i,
        /import\s+requests/i,
        /import\s+pickle/i,
        /eval\s*\(/i,
        /exec\s*\(/i,
        /compile\s*\(/i,
        /__import__/i,
        /open\s*\(/i,
        /file\s*\(/i,
        /input\s*\(/i,
        /raw_input\s*\(/i,
        /\bos\b/i,
        /\bsys\b/i
      ],
      java: [
        /import\s+java\.io/i,
        /import\s+java\.net/i,
        /import\s+java\.lang\.reflect/i,
        /import\s+java\.lang\.Runtime/i,
        /Runtime\.getRuntime/i,
        /System\.exit/i,
        /System\.gc/i,
        /Thread\.sleep/i,
        /ProcessBuilder/i,
        /FileInputStream/i,
        /FileOutputStream/i,
        /Socket/i,
        /ServerSocket/i
      ],
      cpp: [
        /#include\s*<fstream>/i,
        /#include\s*<unistd\.h>/i,
        /#include\s*<sys\/socket\.h>/i,
        /system\s*\(/i,
        /popen\s*\(/i,
        /fork\s*\(/i,
        /exec\s*\(/i,
        /fopen\s*\(/i,
        /freopen\s*\(/i,
        /remove\s*\(/i,
        /rename\s*\(/i
      ],
      javascript: [
        /require\s*\(\s*['"]fs['"]\s*\)/i,
        /require\s*\(\s*['"]http['"]\s*\)/i,
        /require\s*\(\s*['"]https['"]\s*\)/i,
        /require\s*\(\s*['"]net['"]\s*\)/i,
        /require\s*\(\s*['"]child_process['"]\s*\)/i,
        /require\s*\(\s*['"]cluster['"]\s*\)/i,
        /eval\s*\(/i,
        /Function\s*\(/i,
        /setTimeout\s*\(/i,
        /setInterval\s*\(/i,
        /process\.exit/i,
        /process\.kill/i
      ],
      c: [
        /#include\s*<unistd\.h>/i,
        /#include\s*<sys\/socket\.h>/i,
        /system\s*\(/i,
        /popen\s*\(/i,
        /fork\s*\(/i,
        /exec\s*\(/i,
        /fopen\s*\(/i,
        /freopen\s*\(/i,
        /remove\s*\(/i,
        /rename\s*\(/i
      ]
    };

    this.allowedIncludes = {
      python: ['math', 'collections', 'itertools', 'heapq', 'bisect', 'functools', 'operator', 're', 'string', 'random', 'datetime'],
      java: ['java.util.*', 'java.lang.*', 'java.math.*', 'java.text.*'],
      cpp: ['<algorithm>', '<vector>', '<string>', '<map>', '<set>', '<queue>', '<stack>', '<deque>', '<list>', '<unordered_map>', '<unordered_set>', '<climits>', '<cmath>', '<cstring>', '<cctype>'],
      javascript: ['Math', 'Array', 'String', 'Object', 'Number', 'Date', 'JSON'],
      c: ['<stdio.h>', '<stdlib.h>', '<string.h>', '<math.h>', '<limits.h>', '<stdbool.h>']
    };

    this.maxCodeLength = 50000; // 50KB
    this.maxLines = 1000;
  }

  async validateCode(code, language) {
    const errors = [];
    
    try {
      // Check code length
      if (code.length > this.maxCodeLength) {
        errors.push(`Code too long: ${code.length} characters (max: ${this.maxCodeLength})`);
      }

      // Check number of lines
      const lines = code.split('\n').length;
      if (lines > this.maxLines) {
        errors.push(`Too many lines: ${lines} (max: ${this.maxLines})`);
      }

      // Check for dangerous patterns
      const dangerousPatterns = this.dangerousPatterns[language] || [];
      for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
          errors.push(`Dangerous pattern detected: ${pattern.toString()}`);
        }
      }

      // Check for excessive recursion patterns
      if (this.hasExcessiveRecursion(code, language)) {
        errors.push('Potentially infinite recursion detected');
      }

      // Check for infinite loops
      if (this.hasInfiniteLoop(code, language)) {
        errors.push('Potential infinite loop detected');
      }

      // Check for memory bombs
      if (this.hasMemoryBomb(code, language)) {
        errors.push('Potential memory bomb detected');
      }

      // Remove or relax the overly strict check for "Function(" pattern
      // Example: Replace this (or similar):
      // if (/Function\s*\(/i.test(code)) {
      //   errors.push('Dangerous pattern detected: Function constructor');
      // }

      // Instead, only block truly dangerous patterns (like eval, require, process, child_process, etc.)
      // For example:
      if (/eval\s*\(/i.test(code)) {
        errors.push('Dangerous pattern detected: eval');
      }
      if (/require\s*\(/i.test(code)) {
        errors.push('Dangerous pattern detected: require');
      }
      if (/process\./i.test(code)) {
        errors.push('Dangerous pattern detected: process');
      }
      if (/child_process/i.test(code)) {
        errors.push('Dangerous pattern detected: child_process');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings: this.getWarnings(code, language)
      };
    } catch (error) {
      logger.error('Error validating code:', error);
      return {
        isValid: false,
        errors: ['Code validation failed'],
        warnings: []
      };
    }
  }

  hasExcessiveRecursion(code, language) {
    const recursionPatterns = {
      python: /def\s+(\w+)\s*\([^)]*\):\s*[^{]*\1\s*\(/,
      java: /public\s+\w+\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/,
      cpp: /\w+\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/,
      javascript: /function\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/,
      c: /\w+\s+(\w+)\s*\([^)]*\)\s*\{[^}]*\1\s*\(/
    };

    const pattern = recursionPatterns[language];
    if (!pattern) return false;

    const matches = code.match(pattern);
    if (!matches) return false;

    // Check if there's a base case
    const functionName = matches[1];
    const hasBaseCase = new RegExp(`if.*return|return.*if|${functionName}.*<|${functionName}.*>|${functionName}.*==|${functionName}.*!=`).test(code);
    
    return !hasBaseCase;
  }

  hasInfiniteLoop(code, language) {
    const infiniteLoopPatterns = {
      python: [/while\s+True\s*:(?!\s*\n\s*if)/, /while\s+1\s*:(?!\s*\n\s*if)/],
      java: [/while\s*\(\s*true\s*\)(?!\s*\{[^}]*if)/, /for\s*\(\s*;\s*;\s*\)(?!\s*\{[^}]*if)/],
      cpp: [/while\s*\(\s*true\s*\)(?!\s*\{[^}]*if)/, /while\s*\(\s*1\s*\)(?!\s*\{[^}]*if)/, /for\s*\(\s*;\s*;\s*\)(?!\s*\{[^}]*if)/],
      javascript: [/while\s*\(\s*true\s*\)(?!\s*\{[^}]*if)/, /while\s*\(\s*1\s*\)(?!\s*\{[^}]*if)/, /for\s*\(\s*;\s*;\s*\)(?!\s*\{[^}]*if)/],
      c: [/while\s*\(\s*1\s*\)(?!\s*\{[^}]*if)/, /for\s*\(\s*;\s*;\s*\)(?!\s*\{[^}]*if)/]
    };

    const patterns = infiniteLoopPatterns[language] || [];
    return patterns.some(pattern => pattern.test(code));
  }

  hasMemoryBomb(code, language) {
    const memoryBombPatterns = {
      python: [/\[\s*\d+\s*\]\s*\*\s*\d{6,}/, /range\s*\(\s*\d{7,}\s*\)/, /\*\s*\d{6,}/],
      java: [/new\s+\w+\[\s*\d{6,}\s*\]/, /ArrayList\s*\(\s*\d{6,}\s*\)/],
      cpp: [/new\s+\w+\[\s*\d{6,}\s*\]/, /vector<\w+>\s*\(\s*\d{6,}\s*\)/],
      javascript: [/new\s+Array\s*\(\s*\d{6,}\s*\)/, /Array\s*\(\s*\d{6,}\s*\)/],
      c: [/malloc\s*\(\s*\d{7,}\s*\)/, /calloc\s*\(\s*\d{6,}/]
    };

    const patterns = memoryBombPatterns[language] || [];
    return patterns.some(pattern => pattern.test(code));
  }

  getWarnings(code, language) {
    const warnings = [];

    // Check for potentially inefficient patterns
    if (language === 'python' && /for.*in.*range.*len/.test(code)) {
      warnings.push('Consider using enumerate() instead of range(len())');
    }

    if (language === 'java' && /String.*\+=/.test(code)) {
      warnings.push('Consider using StringBuilder for string concatenation in loops');
    }

    if (/sleep|wait|delay/i.test(code)) {
      warnings.push('Sleep/wait functions detected - may cause timeout');
    }

    return warnings;
  }

  sanitizeCode(code) {
    // Remove comments that might contain dangerous instructions
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    code = code.replace(/\/\/.*$/gm, '');
    code = code.replace(/#.*$/gm, '');
    
    // Remove excessive whitespace
    code = code.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return code.trim();
  }
}

module.exports = new SecurityValidator();
