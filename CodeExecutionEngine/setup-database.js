const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Problem = require('./models/Problem');
const TestCase = require('./models/TestCase');
const User = require('./models/User');

async function setupDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform');
    console.log('🔗 Connected to MongoDB');

    // Create an admin user first
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('👤 Admin user created');
    }

    // Create a sample problem: Two Sum
    let problem = await Problem.findOne({ title: 'Two Sum' });
    if (!problem) {
      problem = new Problem({
        title: 'Two Sum',
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

        You may assume that each input would have exactly one solution, and you may not use the same element twice.

        You can return the answer in any order.

        Example 1:
        Input: nums = [2,7,11,15], target = 9
        Output: [0,1]
        Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

        Example 2:
        Input: nums = [3,2,4], target = 6
        Output: [1,2]

        Example 3:
        Input: nums = [3,3], target = 6
        Output: [0,1]`,
                difficulty: 'easy',
                tags: ['array', 'hash-table'],
                timeLimit: 2000,
                memoryLimit: 256,
                examples: [
                {
                    input: 'nums = [2,7,11,15], target = 9',
                    output: '[0,1]',
                    explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
                }
                ],
                constraints: `- 2 <= nums.length <= 10^4
        - -10^9 <= nums[i] <= 10^9
        - -10^9 <= target <= 10^9
        - Only one valid answer exists.`,
        createdBy: adminUser._id,
        isActive: true
      });
      await problem.save();
      console.log('📝 Two Sum problem created');
    }

    // Create test cases for the problem
    const existingTestCases = await TestCase.find({ problem: problem._id });
    if (existingTestCases.length === 0) {
      const testCases = [
        {
          problem: problem._id,
          input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }),
          expectedOutput: JSON.stringify([0, 1]),
          isHidden: false,
          points: 10
        },
        {
          problem: problem._id,
          input: JSON.stringify({ nums: [3, 2, 4], target: 6 }),
          expectedOutput: JSON.stringify([1, 2]),
          isHidden: false,
          points: 10
        },
        {
          problem: problem._id,
          input: JSON.stringify({ nums: [3, 3], target: 6 }),
          expectedOutput: JSON.stringify([0, 1]),
          isHidden: false,
          points: 10
        },
        {
          problem: problem._id,
          input: JSON.stringify({ nums: [1, 2, 3, 4, 5], target: 9 }),
          expectedOutput: JSON.stringify([3, 4]),
          isHidden: true,
          points: 20
        },
        {
          problem: problem._id,
          input: JSON.stringify({ nums: [-1, -2, -3, -4, -5], target: -8 }),
          expectedOutput: JSON.stringify([2, 4]),
          isHidden: true,
          points: 20
        }
      ];

      await TestCase.insertMany(testCases);
      console.log('✅ Test cases created');
    }

    // Create a simple problem: Add Two Numbers
    let simpleProblem = await Problem.findOne({ title: 'Add Two Numbers' });
    if (!simpleProblem) {
      simpleProblem = new Problem({
        title: 'Add Two Numbers',
        description: `Write a function that takes two numbers and returns their sum.

Function signature:
def solution(a, b):
    # Your code here
    return result

Example:
Input: a = 5, b = 3
Output: 8`,
        difficulty: 'easy',
        tags: ['math', 'basic'],
        timeLimit: 1000,
        memoryLimit: 128,
        examples: [
          {
            input: 'a = 5, b = 3',
            output: '8',
            explanation: '5 + 3 = 8'
          }
        ],
        constraints: '- -1000 <= a, b <= 1000',
        createdBy: adminUser._id,
        isActive: true
      });
      await simpleProblem.save();
      console.log('📝 Add Two Numbers problem created');
    }

    // Create test cases for simple problem
    const existingSimpleTestCases = await TestCase.find({ problem: simpleProblem._id });
    if (existingSimpleTestCases.length === 0) {
      const simpleTestCases = [
        {
          problem: simpleProblem._id,
          input: JSON.stringify({ a: 5, b: 3 }),
          expectedOutput: "8",
          isHidden: false,
          points: 20
        },
        {
          problem: simpleProblem._id,
          input: JSON.stringify({ a: -2, b: 7 }),
          expectedOutput: "5",
          isHidden: false,
          points: 20
        },
        {
          problem: simpleProblem._id,
          input: JSON.stringify({ a: 0, b: 0 }),
          expectedOutput: "0",
          isHidden: true,
          points: 30
        },
        {
          problem: simpleProblem._id,
          input: JSON.stringify({ a: -10, b: -5 }),
          expectedOutput: "-15",
          isHidden: true,
          points: 30
        }
      ];

      await TestCase.insertMany(simpleTestCases);
      console.log('✅ Simple test cases created');
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\n📊 Available Problems:');
    console.log(`1. Two Sum - ID: ${problem._id}`);
    console.log(`2. Add Two Numbers - ID: ${simpleProblem._id}`);
    
    console.log('\n💡 Use these problem IDs in your API requests');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
