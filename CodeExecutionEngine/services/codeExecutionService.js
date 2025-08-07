const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute Python code
const executePythonCode = async (code, input) => {
  const tempFilePath = path.join(__dirname, 'temp_solution.py');
  
  try {
    // Parse the input if it's a string
    let parsedInput;
    try {
      parsedInput = typeof input === 'string' ? JSON.parse(input) : input;
    } catch (e) {
      parsedInput = input;
    }

    // Create a temporary Python file with a wrapper to capture the output
    const wrappedCode = `
${code}

# Add this wrapper to capture the return value
if __name__ == "__main__":
    import json
    import sys
    
    try:
        # Parse input
        input_data = json.loads('${JSON.stringify(parsedInput)}')
        
        # Call the solution function with the correct arguments
        if isinstance(input_data, dict):
            # If input is a dictionary, extract values in order or use named parameters
            if len(input_data) == 2 and 'a' in input_data and 'b' in input_data:
                # For the specific case of a, b parameters
                result = solution(input_data['a'], input_data['b'])
            else:
                # Try to call with named parameters
                result = solution(**input_data)
        elif isinstance(input_data, list):
            # If input is a list, use as positional arguments
            result = solution(*input_data)
        else:
            # Single parameter
            result = solution(input_data)
        
        # Make sure to print the result
        print(result)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
`;

    // Write to temp file
    fs.writeFileSync(tempFilePath, wrappedCode);

    // Use synchronous execution for simplicity and reliability
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const child = spawn('python3', [tempFilePath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 10000 // 10 second timeout
      });
      
      let stdout = '';
      let stderr = '';
      
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      child.on('close', (code) => {
        const endTime = Date.now();
        
        // Clean up temp file
        try {
          fs.unlinkSync(tempFilePath);
        } catch (err) {
          console.error('Error cleaning up temp file:', err);
        }
        
        resolve({
          output: stdout.trim(),
          error: stderr.trim(),
          executionTime: endTime - startTime,
          exitCode: code
        });
      });
      
      child.on('error', (error) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempFilePath);
        } catch (err) {
          console.error('Error cleaning up temp file:', err);
        }
        
        resolve({
          output: '',
          error: error.message,
          executionTime: Date.now() - startTime,
          exitCode: 1
        });
      });
    });
  } catch (error) {
    console.error('Error setting up Python execution:', error);
    // Clean up if possible
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    return {
      output: '',
      error: error.message || 'Failed to set up execution',
      executionTime: 0,
      exitCode: 1
    };
  }
};

// New function to execute code with timeout
const executeCode = async (code, language) => {
  const timeout = 10000; // 10 seconds max
  
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Code execution timeout'));
    }, timeout);
    
    // ...existing code...
    
    clearTimeout(timer);
  });
};

module.exports = {
  executePythonCode
};