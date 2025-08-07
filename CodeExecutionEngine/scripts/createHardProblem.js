const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

async function createHardProblem() {
  try {
    // Use the same database connection as your main app
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/codeplatform';
    console.log('Connecting to MongoDB:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in log
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
    
    // First, let's check what database we're actually connected to
    const dbName = mongoose.connection.db.databaseName;
    console.log('Connected to database:', dbName);
    
    // List existing problems to verify connection
    const existingProblems = await Problem.find({}, 'title difficulty').lean();
    console.log(`Found ${existingProblems.length} existing problems in database:`);
    existingProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} (${problem.difficulty})`);
    });
    
    // Clean up any existing "Median of Two Sorted Arrays" problems
    const deleteResult = await Problem.deleteMany({ title: 'Median of Two Sorted Arrays' });
    console.log(`Cleaned up ${deleteResult.deletedCount} existing "Median of Two Sorted Arrays" problems`);
    
    // Define test cases for the hard problem
    const testCases = [
      { 
        input: '[1,3]\n[2]', 
        output: '2.0', 
        isHidden: false 
      },
      { 
        input: '[1,2]\n[3,4]', 
        output: '2.5', 
        isHidden: false 
      },
      { 
        input: '[0,0]\n[0,0]', 
        output: '0.0', 
        isHidden: false 
      },
      { 
        input: '[]\n[1]', 
        output: '1.0', 
        isHidden: false 
      },
      { 
        input: '[2]\n[]', 
        output: '2.0', 
        isHidden: false 
      },
      { 
        input: '[1,3,8,9,15]\n[7,11,18,19,21,25]', 
        output: '11.0', 
        isHidden: true 
      },
      { 
        input: '[23,26,31,35]\n[3,5,7,9,11,16]', 
        output: '13.5', 
        isHidden: true 
      },
      { 
        input: '[1,2,3,4,5]\n[6,7,8,9,10]', 
        output: '5.5', 
        isHidden: true 
      }
    ];
    
    const hardProblem = new Problem({
      title: 'Median of Two Sorted Arrays',
      description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).

**Example 1:**
Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.

**Example 2:**
Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.

**Constraints:**
- nums1.length == m
- nums2.length == n
- 0 <= m <= 1000
- 0 <= n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6

**Follow up:** The algorithm should run in O(log(m + n)) time complexity.`,
      difficulty: 'hard',
      tags: ['array', 'binary-search', 'divide-and-conquer'],
      testCases: testCases,
      functionSignatures: new Map([
        ['java', 'public double findMedianSortedArrays(int[] nums1, int[] nums2)'],
        ['python', 'def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:'],
        ['cpp', 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2)'],
        ['javascript', 'function findMedianSortedArrays(nums1, nums2)'],
        ['c', 'double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size)']
      ]),
      timeLimit: 5000, // Increased to 5000ms
      memoryLimit: 512,
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true // Ensure it's active
    });

    // Use save() with explicit error handling
    try {
      const savedProblem = await hardProblem.save();
      console.log('Hard problem saved successfully:', savedProblem._id);
      
      // Verify it was saved by querying back
      const verifyProblem = await Problem.findById(savedProblem._id);
      if (verifyProblem) {
        console.log('✅ Problem verified in database');
        console.log('Title:', verifyProblem.title);
        console.log('Test cases count:', verifyProblem.testCases.length);
      } else {
        console.error('❌ Problem not found after save');
      }
    } catch (saveError) {
      console.error('Error saving hard problem:', saveError);
      throw saveError;
    }
    
    // Test the driver code generation for each language
    const driverCodeGenerator = require('../src/services/driverCodeGenerator');
    
    // Test solutions for different languages
    const testSolutions = {
      java: `if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int x = nums1.length;
        int y = nums2.length;
        
        int low = 0;
        int high = x;
        
        while (low <= high) {
            int cutx = (low + high) / 2;
            int cuty = (x + y + 1) / 2 - cutx;
            
            int maxleftx = (cutx == 0) ? Integer.MIN_VALUE : nums1[cutx - 1];
            int minrightx = (cutx == x) ? Integer.MAX_VALUE : nums1[cutx];
            
            int maxlefty = (cuty == 0) ? Integer.MIN_VALUE : nums2[cuty - 1];
            int minrighty = (cuty == y) ? Integer.MAX_VALUE : nums2[cuty];
            
            if (maxleftx <= minrighty && maxlefty <= minrightx) {
                if ((x + y) % 2 == 0) {
                    return ((double)Math.max(maxleftx, maxlefty) + Math.min(minrightx, minrighty)) / 2;
                } else {
                    return (double)Math.max(maxleftx, maxlefty);
                }
            } else if (maxleftx > minrighty) {
                high = cutx - 1;
            } else {
                low = cutx + 1;
            }
        }
        
        return 1.0;`,
      
      python: `if len(nums1) > len(nums2):
            return self.findMedianSortedArrays(nums2, nums1)
        
        x, y = len(nums1), len(nums2)
        low, high = 0, x
        
        while low <= high:
            cutx = (low + high) // 2
            cuty = (x + y + 1) // 2 - cutx
            
            maxleftx = float('-inf') if cutx == 0 else nums1[cutx - 1]
            minrightx = float('inf') if cutx == x else nums1[cutx]
            
            maxlefty = float('-inf') if cuty == 0 else nums2[cuty - 1]
            minrighty = float('inf') if cuty == y else nums2[cuty]
            
            if maxleftx <= minrighty and maxlefty <= minrightx:
                if (x + y) % 2 == 0:
                    return (max(maxleftx, maxlefty) + min(minrightx, minrighty)) / 2.0
                else:
                    return float(max(maxleftx, maxlefty))
            elif maxleftx > minrighty:
                high = cutx - 1
            else:
                low = cutx + 1
        
        return 1.0`,
      
      cpp: `if (nums1.size() > nums2.size()) {
            return findMedianSortedArrays(nums2, nums1);
        }
        
        int x = nums1.size();
        int y = nums2.size();
        
        int low = 0;
        int high = x;
        
        while (low <= high) {
            int cutx = (low + high) / 2;
            int cuty = (x + y + 1) / 2 - cutx;
            
            int maxleftx = (cutx == 0) ? INT_MIN : nums1[cutx - 1];
            int minrightx = (cutx == x) ? INT_MAX : nums1[cutx];
            
            int maxlefty = (cuty == 0) ? INT_MIN : nums2[cuty - 1];
            int minrighty = (cuty == y) ? INT_MAX : nums2[cuty];
            
            if (maxleftx <= minrighty && maxlefty <= minrightx) {
                if ((x + y) % 2 == 0) {
                    return ((double)max(maxleftx, maxlefty) + min(minrightx, minrighty)) / 2;
                } else {
                    return (double)max(maxleftx, maxlefty);
                }
            } else if (maxleftx > minrighty) {
                high = cutx - 1;
            } else {
                low = cutx + 1;
            }
        }
        
        return 1.0;`
    };
    
    console.log('\n=== TESTING DRIVER CODE GENERATION ===');
    for (const [language, solution] of Object.entries(testSolutions)) {
      try {
        console.log(`\nTesting ${language.toUpperCase()} driver generation...`);
        
        // Convert Mongoose documents to plain objects
        const plainTestCases = hardProblem.testCases.map(tc => {
          // Handle Mongoose document conversion
          if (tc.toObject) {
            return tc.toObject();
          } else if (tc._doc) {
            return tc._doc;
          } else {
            return {
              input: tc.input,
              output: tc.output,
              isHidden: tc.isHidden,
              _id: tc._id
            };
          }
        });
        
        console.log('Plain test cases for driver generation:', plainTestCases.slice(0, 2)); // Show first 2 for debugging
        
        const driverCode = driverCodeGenerator.generate(
          language,
          hardProblem.functionSignatures.get(language),
          plainTestCases,
          solution
        );
        
        console.log(`✅ ${language} driver code generated successfully!`);
        
        // Write the generated code to a file for inspection
        const fs = require('fs');
        const path = require('path');
        const outputPath = path.join(__dirname, `generated_hard_problem_${language}.${language === 'cpp' ? 'cpp' : language}`);
        fs.writeFileSync(outputPath, driverCode);
        console.log(`📁 Full driver code written to: ${outputPath}`);
        
      } catch (error) {
        console.error(`❌ ${language} driver code generation failed:`, error.message);
      }
    }
    console.log('======================================');
    
    // Create second problem with explicit save
    const deleteResult2 = await Problem.deleteMany({ title: 'Trapping Rain Water' });
    console.log(`\n=== Creating second hard problem ===`);
    console.log(`Cleaned up ${deleteResult2.deletedCount} existing "Trapping Rain Water" problems`);
    
    const rainWaterTestCases = [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', isHidden: false },
      { input: '[4,2,0,3,2,5]', output: '9', isHidden: false },
      { input: '[1,1,1,1]', output: '0', isHidden: false },
      { input: '[5,4,1,2]', output: '1', isHidden: true },
      { input: '[2,0,2]', output: '2', isHidden: true },
      { input: '[3,0,1,3,0,5]', output: '8', isHidden: true }
    ];
    
    const rainWaterProblem = new Problem({
      title: 'Trapping Rain Water',
      description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

**Example 1:**
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

**Example 2:**
Input: height = [4,2,0,3,2,5]
Output: 9

**Constraints:**
- n == height.length
- 1 <= n <= 2 * 10^4
- 0 <= height[i] <= 3 * 10^4`,
      difficulty: 'hard',
      tags: ['array', 'two-pointers', 'dynamic-programming', 'stack', 'monotonic-stack'],
      testCases: rainWaterTestCases,
      functionSignatures: new Map([
        ['java', 'public int trap(int[] height)'],
        ['python', 'def trap(self, height: List[int]) -> int:'],
        ['cpp', 'int trap(vector<int>& height)'],
        ['javascript', 'function trap(height)'],
        ['c', 'int trap(int* height, int heightSize)']
      ]),
      timeLimit: 5000, // Increased to 5000ms
      memoryLimit: 256,
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true
    });

    try {
      const savedRainWater = await rainWaterProblem.save();
      console.log('Rain water problem saved successfully:', savedRainWater._id);
      
      // Verify it was saved
      const verifyRainWater = await Problem.findById(savedRainWater._id);
      if (verifyRainWater) {
        console.log('✅ Rain water problem verified in database');
      }
    } catch (saveError) {
      console.error('Error saving rain water problem:', saveError);
    }
    
    // Create third problem with explicit save
    const deleteResult3 = await Problem.deleteMany({ title: 'Regular Expression Matching' });
    console.log(`Cleaned up ${deleteResult3.deletedCount} existing "Regular Expression Matching" problems`);
    
    const regexTestCases = [
      { input: 'aa\na', output: 'false', isHidden: false },
      { input: 'aa\na*', output: 'true', isHidden: false },
      { input: 'ab\n.*', output: 'true', isHidden: false },
      { input: 'aab\nc*a*b', output: 'true', isHidden: false },
      { input: 'mississippi\nmis*is*p*.', output: 'false', isHidden: false },
      { input: 'ab\n.*c', output: 'false', isHidden: true },
      { input: 'aaa\na*a', output: 'true', isHidden: true },
      { input: 'a\nab*', output: 'true', isHidden: true }
    ];
    
    const regexProblem = new Problem({
      title: 'Regular Expression Matching',
      description: `Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

- '.' Matches any single character.
- '*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).

**Example 1:**
Input: s = "aa", p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".

**Example 2:**
Input: s = "aa", p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".

**Example 3:**
Input: s = "ab", p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".

**Constraints:**
- 1 <= s.length <= 20
- 1 <= p.length <= 30
- s contains only lowercase English letters.
- p contains only lowercase English letters, '.', and '*'.
- It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.`,
      difficulty: 'hard',
      tags: ['string', 'dynamic-programming', 'recursion'],
      testCases: regexTestCases,
      functionSignatures: new Map([
        ['java', 'public boolean isMatch(String s, String p)'],
        ['python', 'def isMatch(self, s: str, p: str) -> bool:'],
        ['cpp', 'bool isMatch(string s, string p)'],
        ['javascript', 'function isMatch(s, p)'],
        ['c', 'bool isMatch(char* s, char* p)']
      ]),
      timeLimit: 5000, // Increased to 5000ms
      memoryLimit: 256,
      createdBy: new mongoose.Types.ObjectId(),
      isActive: true
    });

    try {
      const savedRegex = await regexProblem.save();
      console.log('Regex problem saved successfully:', savedRegex._id);
      
      // Verify it was saved
      const verifyRegex = await Problem.findById(savedRegex._id);
      if (verifyRegex) {
        console.log('✅ Regex problem verified in database');
      }
    } catch (saveError) {
      console.error('Error saving regex problem:', saveError);
    }
    
    // Final verification - count all problems
    const totalProblems = await Problem.countDocuments({});
    console.log(`\n=== FINAL VERIFICATION ===`);
    console.log(`Total problems in database: ${totalProblems}`);
    
    // List all problems
    const allProblems = await Problem.find({}, 'title difficulty').lean();
    console.log('All problems in database:');
    allProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} (${problem.difficulty})`);
    });
    
    console.log('\n=== SUMMARY ===');
    console.log('✅ Created 3 hard problems:');
    console.log('1. Median of Two Sorted Arrays (Binary Search)');
    console.log('2. Trapping Rain Water (Two Pointers/DP)');
    console.log('3. Regular Expression Matching (Dynamic Programming)');
    console.log('================');
    
    // Close the connection properly
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('Error creating hard problems:', error);
    console.error('Stack trace:', error.stack);
    
    // Close connection on error too
    try {
      await mongoose.connection.close();
    } catch (closeError) {
      console.error('Error closing connection:', closeError);
    }
    
    process.exit(1);
  }
}

createHardProblem();
