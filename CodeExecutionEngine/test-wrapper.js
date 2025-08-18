const dockerManager = require('./services/DockerManager');

async function testPythonWrapper() {
  try {
    // Test the Python wrapper generation
    const userCode = "def solution(a, b):\n    return a + b";
    const inputData = { a: 5, b: 3 };
    
    const wrapper = dockerManager.createPythonWrapper(userCode, inputData);
    console.log("Generated Python wrapper:");
    console.log("=".repeat(50));
    console.log(wrapper);
    console.log("=".repeat(50));
    
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testPythonWrapper();
