const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config();

async function createAdvancedProblems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/codeexec_dev');
    console.log('Connected to database...');

    const problems = [
      {
        title: 'Palindrome Partitioning II',
        description: `Given a string s, partition s such that every substring is a palindrome.

Return the minimum cuts needed for a palindrome partitioning of s.

**Example 1:**
Input: s = "aab"
Output: 1

**Constraints:**
- 1 <= s.length <= 2000
- s consists of lowercase English letters only.`,
        difficulty: 'hard',
        tags: ['dynamic-programming', 'string'],
        testCases: [
          { input: '"aab"', output: '1', isHidden: false },
          { input: '"a"', output: '0', isHidden: false },
          { input: '"abccbc"', output: '1', isHidden: true }
        ],
        functionSignatures: new Map([
          ['javascript', 'function minCut(s)'],
          ['python', 'def minCut(self, s: str) -> int'],
          ['java', 'public int minCut(String s)'],
          ['cpp', 'int minCut(string s)']
        ])
      },

      {
        title: 'Word Break II',
        description: `Given a string s and a dictionary of strings wordDict, return all possible
ways to segment s into a space-separated sequence of dictionary words. You may print the output in any order.
**Example 1:**
Input: s = "catsanddog", wordDict = ["cat","cats","and","
dog","sand"]
Output: ["cats and dog","cat sand dog"]
**Constraints:**
- 1 <= s.length <= 20
- 1 <= wordDict.length <= 1000
- 1 <= wordDict[i].length <= 20
- All strings in wordDict are unique.`,
        difficulty: 'hard',
        tags: ['backtracking', 'dynamic-programming'],
        testCases: [
          { input: '"catsanddog"\n["cat","cats","and","dog",""sand"]', output: '["cats and dog","cat sand dog"]', isHidden: false },
          { input: '"pineapplepenapple"\n["apple","pen","applepen","pine","pineapple"]', output: '["pine apple pen apple","pineapple pen apple","pine applepen apple"]', isHidden: false },
          { input: '"leetcode"\n["leet","code"]', output: '["leet code"]', isHidden: true }

        ],
        functionSignatures: new Map([
          ['javascript', 'function wordBreak(s, wordDict)'],
          ['python', 'def wordBreak(self, s: str, wordDict: List[str]) -> List[str]'],
          ['java', 'public List<String> wordBreak(String s, List<String> wordDict)'],
          ['cpp', 'vector<string> wordBreak(string s, vector<string>& wordDict)']
        ])
      },

      {
        title: 'Trapping Rain Water II',
        description: `Given an m x n integer matrix heightMap representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining.

**Example 1:**
Input: heightMap = [
  [1,4,3,1,3,2],
  [3,2,1,3,2,4],
  [2,3,3,2,3,1]
]
Output: 4

**Constraints:**
- 1 <= m, n <= 110
- 0 <= heightMap[i][j] <= 20000`,
        difficulty: 'hard',
        tags: ['heap', 'priority-queue', 'bfs'],
        testCases: [
          { input: '[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]', output: '4', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function trapRainWater(heightMap)'],
          ['python', 'def trapRainWater(self, heightMap: List[List[int]]) -> int'],
          ['java', 'public int trapRainWater(int[][] heightMap)'],
          ['cpp', 'int trapRainWater(vector<vector<int>>& heightMap)']
        ])
      },

      {
        title: 'Edit Distance',
        description: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character

**Example 1:**
Input: word1 = "horse", word2 = "ros"
Output: 3

**Constraints:**
- 0 <= word1.length, word2.length <= 500`,
        difficulty: 'hard',
        tags: ['dynamic-programming', 'string'],
        testCases: [
          { input: '"horse"\n"ros"', output: '3', isHidden: false },
          { input: '"intention"\n"execution"', output: '5', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function minDistance(word1, word2)'],
          ['python', 'def minDistance(self, word1: str, word2: str) -> int'],
          ['java', 'public int minDistance(String word1, String word2)'],
          ['cpp', 'int minDistance(string word1, string word2)']
        ])
      },

      {
        title: 'Maximum Profit in Job Scheduling',
        description: `You are given n jobs where every job is represented as (startTime, endTime, profit). Return the maximum profit you can take such that there are no two jobs that overlap.

**Example 1:**
Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70]
Output: 120

**Constraints:**
- 1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4
- 1 <= startTime[i] < endTime[i] <= 10^9`,
        difficulty: 'hard',
        tags: ['dp', 'binary-search', 'greedy'],
        testCases: [
          { input: '[1,2,3,3]\n[3,4,5,6]\n[50,10,40,70]', output: '120', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function jobScheduling(startTime, endTime, profit)'],
          ['python', 'def jobScheduling(self, startTime: List[int], endTime: List[int], profit: List[int]) -> int'],
          ['java', 'public int jobScheduling(int[] startTime, int[] endTime, int[] profit)'],
          ['cpp', 'int jobScheduling(vector<int>& startTime, vector<int>& endTime, vector<int>& profit)']
        ])
      },

      {
        title: 'Alien Dictionary',
        description: `There is a new alien language that uses the English alphabet, but the order of the letters is unknown. Given a sorted list of words, return the order of characters.

**Example:**
Input: ["wrt","wrf","er","ett","rftt"]
Output: "wertf"

**Constraints:**
- 1 <= words.length <= 100
- 1 <= words[i].length <= 100`,
        difficulty: 'hard',
        tags: ['graph', 'topological-sort'],
        testCases: [
          { input: '["wrt","wrf","er","ett","rftt"]', output: '"wertf"', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function alienOrder(words)'],
          ['python', 'def alienOrder(self, words: List[str]) -> str'],
          ['java', 'public String alienOrder(String[] words)'],
          ['cpp', 'string alienOrder(vector<string>& words)']
        ])
      },

      {
        title: 'Remove Invalid Parentheses',
        description: `Remove the minimum number of invalid parentheses to make the input string valid. Return all possible results.

**Example:**
Input: "()())()"
Output: ["(())()","()()()"]

**Constraints:**
- 1 <= s.length <= 25
- s consists of '(' , ')' and lowercase letters.`,
        difficulty: 'hard',
        tags: ['backtracking', 'breadth-first-search'],
        testCases: [
          { input: '"()())()"', output: '["(())()","()()()"]', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function removeInvalidParentheses(s)'],
          ['python', 'def removeInvalidParentheses(self, s: str) -> List[str]'],
          ['java', 'public List<String> removeInvalidParentheses(String s)'],
          ['cpp', 'vector<string> removeInvalidParentheses(string s)']
        ])
      },

      {
        title: 'Burst Balloons',
        description: `You are given n balloons, each balloon is painted with a number. You burst them to collect coins. Return the maximum coins you can collect by bursting them wisely.

**Example:**
Input: [3,1,5,8]
Output: 167

**Constraints:**
- 1 <= nums.length <= 500
- 0 <= nums[i] <= 100`,
        difficulty: 'hard',
        tags: ['dp', 'divide-and-conquer'],
        testCases: [
          { input: '[3,1,5,8]', output: '167', isHidden: false },
          { input: '[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]', output: '625', isHidden: true }
        ],
        functionSignatures: new Map([
          ['javascript', 'function maxCoins(nums)'],
          ['python', 'def maxCoins(self, nums: List[int]) -> int'],
          ['java', 'public int maxCoins(int[] nums)'],
          ['cpp', 'int maxCoins(vector<int>& nums)']
        ])
      },

      {
        title: 'Russian Doll Envelopes',
        description: `Given a number of envelopes with widths and heights, find the maximum number of envelopes you can Russian doll.

**Example:**
Input: [[5,4],[6,4],[6,7],[2,3]]
Output: 3

**Constraints:**
- 1 <= envelopes.length <= 10^5
- envelopes[i].length == 2`,
        difficulty: 'hard',
        tags: ['binary-search', 'dp'],
        testCases: [
          { input: '[[5,4],[6,4],[6,7],[2,3]]', output: '3', isHidden: false },
        ],
        functionSignatures: new Map([
          ['javascript', 'function maxEnvelopes(envelopes)'],
          ['python', 'def maxEnvelopes(self, envelopes: List[List[int]]) -> int'],
          ['java', 'public int maxEnvelopes(int[][] envelopes)'],
          ['cpp', 'int maxEnvelopes(vector<vector<int>>& envelopes)']
        ])
      },

      {
        title: 'Scramble String',
        description: `Given two strings s1 and s2, return true if s2 is a scrambled string of s1.

**Example:**
Input: s1 = "great", s2 = "rgeat"
Output: true

**Constraints:**
- s1.length == s2.length
- 1 <= s1.length <= 30`,
        difficulty: 'hard',
        tags: ['recursion', 'string', 'dp'],
        testCases: [
          { input: '"great"\n"rgeat"', output: 'true', isHidden: false },
          { input: '"abcde"\n"caebd"', output: 'false', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function isScramble(s1, s2)'],
          ['python', 'def isScramble(self, s1: str, s2: str) -> bool'],
          ['java', 'public boolean isScramble(String s1, String s2)'],
          ['cpp', 'bool isScramble(string s1, string s2)']
        ])
      },

      {
        title: 'The Skyline Problem',
        description: `Given a list of buildings in the skyline, return the critical points that form the skyline.

**Example:**
Input: [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]

**Constraints:**
- 1 <= buildings.length <= 10^4
- 0 <= left < right <= 2^31 - 1`,
        difficulty: 'hard',
        tags: ['heap', 'divide-and-conquer'],
        testCases: [
          { input: '[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]', output: '[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]', isHidden: false }
        ],
        functionSignatures: new Map([
          ['javascript', 'function getSkyline(buildings)'],
          ['python', 'def getSkyline(self, buildings: List[List[int]]) -> List[List[int]]'],
          ['java', 'public List<List<Integer>> getSkyline(int[][] buildings)'],
          ['cpp', 'vector<vector<int>> getSkyline(vector<vector<int>>& buildings)']
        ])
      }
    ];

    console.log(`Creating ${problems.length} advanced hard problems...`);

    for (const problemData of problems) {
      await Problem.deleteMany({ title: problemData.title });

      const problem = new Problem({
        ...problemData,
        timeLimit: 5000,
        memoryLimit: 512,
        createdBy: new mongoose.Types.ObjectId()
      });

      await problem.save();
      console.log(`✅ Created: ${problem.title} (ID: ${problem._id})`);
    }

    console.log('\n=== ALL ADVANCED PROBLEMS CREATED SUCCESSFULLY ===');
    process.exit(0);
  } catch (error) {
    console.error('Error creating advanced problems:', error);
    process.exit(1);
  }
}

createAdvancedProblems();
