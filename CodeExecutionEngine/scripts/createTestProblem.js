const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

async function createTestProblem() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform');
    
    // Clean up any existing "Reverse Integer" problems
    await Problem.deleteMany({ title: 'Reverse Integer' });
    console.log('Cleaned up existing "Reverse Integer" problems');
    
    // Define test cases properly as embedded documents
    const testCases = [
      { input: '123', output: '321', isHidden: false },
      { input: '-123', output: '-321', isHidden: false },
      { input: '120', output: '21', isHidden: false },
      { input: '0', output: '0', isHidden: false },
      { input: '1534236469', output: '0', isHidden: true } // This should overflow
    ];
    
    const testProblem = new Problem({
      title: 'Reverse Integer',
      description: 'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.',
      difficulty: 'medium',
      tags: ['math', 'integer'],
      testCases: testCases, // Embed test cases directly in the problem
      functionSignatures: new Map([
        ['java', 'public int reverse(int x)'],
        ['python', 'def reverse(self, x: int) -> int:'],
        ['cpp', 'int reverse(int x)']
      ]),
      timeLimit: 1000,
      memoryLimit: 256,
      createdBy: new mongoose.Types.ObjectId() // Dummy user ID
    });

    await testProblem.save();
    console.log('Test problem created successfully:', testProblem._id);
    console.log('Function signatures:', Object.fromEntries(testProblem.functionSignatures));
    console.log('Test cases count:', testProblem.testCases.length);
    console.log('Test cases:', testProblem.testCases);
    
    // Test the driver code generation
    const driverCodeGenerator = require('../src/services/driverCodeGenerator');
    
    // Test with method body only (user input)
    const testUserCode = `int res = 0;
        boolean isNegative = x < 0;
        String strX = String.valueOf(Math.abs(x));
        StringBuilder sb = new StringBuilder(strX).reverse();
        
        try {
            res = Integer.parseInt(sb.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
        
        return isNegative ? -res : res;`;
    
    console.log('\n=== TESTING DRIVER CODE GENERATION ===');
    try {
      const driverCode = driverCodeGenerator.generate(
        'java',
        testProblem.functionSignatures.get('java'),
        testProblem.testCases, // Use embedded test cases
        testUserCode
      );
      console.log('Driver code generated successfully!');
      console.log('Generated code preview:');
      console.log(driverCode.substring(0, 500) + '...');
      
      // Write the generated code to a file for inspection
      const fs = require('fs');
      const path = require('path');
      const outputPath = path.join(__dirname, 'generated_driver_code.java');
      fs.writeFileSync(outputPath, driverCode);
      console.log(`Full driver code written to: ${outputPath}`);
      
    } catch (error) {
      console.error('Driver code generation failed:', error.message);
      console.error('Error stack:', error.stack);
    }
    console.log('======================================');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test problem:', error);
    process.exit(1);
  }
}

createTestProblem();
