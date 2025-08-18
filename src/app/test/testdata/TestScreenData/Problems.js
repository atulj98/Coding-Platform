const problems = [
  {
    problem_no: 1,
    title: "Prime Number Check",
    description: "Check whether a given number is a prime number or not.",
    constraints: [
      "1 ≤ n ≤ 10⁷",
      "Time limit: 1 second",
      "Memory limit: 128 MB"
    ],
    tags: ["Mathematics", "Optimization"],
    showTags : false,
    points: 150,
    examples: [
      { input: "5", output: "true" },
      { input: "10", output: "false" }
    ],
    supportedLanguages: [
      {
        id: "javascript",
        name: "JavaScript",
        value: "javascript",
        template: `function isPrime(n) {
  // write your code here...
}

// Driver code
console.log(isPrime(5));`
      },
      {
        id: "python",
        name: "Python",
        value: "python",
        template: `def is_prime(n):
    # write your code here...

# Driver code
print(is_prime(5))`
      }
    ]
  },

  {
    problem_no: 2,
    title: "Count Binary Ones",
    description: "Given an integer, count the number of 1s in its binary representation.",
    constraints: [
      "0 ≤ n ≤ 10⁹",
      "Time limit: 1 second",
      "Memory limit: 64 MB"
    ],
    points: 100,
    tags: ["Bit Manipulation", "Mathematics", "Optimization"],
    showTags : false,
    examples: [
      { input: "5", output: "2" },
      { input: "15", output: "4" }
    ],
    supportedLanguages: [
      {
        id: "javascript",
        name: "JavaScript",
        value: "javascript",
        template: `function countOnes(n) {
  // write your code here...
}

// Driver code
console.log(countOnes(5));`
      },
      {
        id: "python",
        name: "Python",
        value: "python",
        template: `def count_ones(n):
    # write your code here...

# Driver code
print(count_ones(5))`
      }
    ]
  },

  {
    problem_no: 3,
    title: "Palindrome String Checker",
    description: "Check if a given string is a palindrome. Ignore spaces and casing.",
    constraints: [
      "1 ≤ length of input ≤ 10⁵",
      "Only ASCII characters",
      "Time limit: 1 second"
    ],
    points: 200,
    tags: ["Strings", "Two Pointers", "Optimization"],
    showTags : false,
    examples: [
      { input: `"racecar"`, output: "true" },
      { input: `"hello"`, output: "false" }
    ],
    supportedLanguages: [
      {
        id: "javascript",
        name: "JavaScript",
        value: "javascript",
        template: `function isPalindrome(str) {
  // write your code here...
}

// Driver code
console.log(isPalindrome("Was it a car or a cat I saw"));`
      },
      {
        id: "python",
        name: "Python",
        value: "python",
        template: `def is_palindrome(s):
    # write your code here...

# Driver code
print(is_palindrome("Was it a car or a cat I saw"))`
      }
    ]
  },

  {
    problem_no: 4,
    title: "Maximum Subarray Sum",
    description: "Find the contiguous subarray within a 1D array that has the largest sum.",
    constraints: [
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds"
    ],
    points: 200,
    tags: ["Dynamic Programming", "Mathematics", "Array", "optimization"],
    showTags : false,
    examples: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }
    ],
    supportedLanguages: [
      {
        id: "javascript",
        name: "JavaScript",
        value: "javascript",
        template: `function maxSubarraySum(arr) {
  // write your code here...
}

// Driver code
console.log(maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]));`
      },
      {
        id: "python",
        name: "Python",
        value: "python",
        template: `def max_subarray_sum(arr):
    # write your code here...

# Driver code
print(max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]))`
      }
    ]
  },
  {
    problem_no: 5,
    title: "Maximum Subarray Sum II",
    description: "Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum. Find the contiguous subarray within a 1D array that has the largest sum.",
    constraints: [
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
      "1 ≤ n ≤ 10⁶",
      "-10⁴ ≤ arr[i] ≤ 10⁴",
      "Time limit: 1.5 seconds",
    ],
    points: 200,
    tags: ["Dynamic Programming", "Mathematics", "Array", "optimization"],
    showTags : false,
    examples: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
    ],
    supportedLanguages: [
      {
        id: "javascript",
        name: "JavaScript",
        value: "javascript",
        template: `function maxSubarraySum(arr) {
  // write your code here...
}

// Driver code
console.log(maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]));`
      },
      {
        id: "python",
        name: "Python",
        value: "python",
        template: `def max_subarray_sum(arr):
    # write your code here...

# Driver code
print(max_subarray_sum([-2,1,-3,4,-1,2,1,-5,4]))`
      }
    ]
  },
  
];

export default problems;
