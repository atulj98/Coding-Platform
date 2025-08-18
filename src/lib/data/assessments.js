// lib/data/assessments.js

// Assessment statuses
export const ASSESSMENT_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

// Test types
export const TEST_TYPES = {
  CODING: 'Coding Test',
  THEORY: 'Theory Test',
  MIXED: 'Mixed Test'
};

// Data structures
export const DATA_STRUCTURES = {
  ARRAYS: 'Arrays',
  LINKED_LISTS: 'Linked Lists',
  STACKS: 'Stacks',
  QUEUES: 'Queues',
  TREES: 'Trees',
  GRAPHS: 'Graphs',
  HASH_TABLES: 'Hash Tables'
};

// Subjects
export const SUBJECTS = {
  JAVA: 'Java',
  JAVASCRIPT: 'JavaScript',
  PYTHON: 'Python',
  SQL: 'SQL',
  CPP: 'C++',
  DSA: 'Data Structures & Algorithms'
};

// Generate comprehensive assessments for each data structure
const generateAssessments = () => {
  const dataStructures = Object.values(DATA_STRUCTURES);
  const testTypes = Object.values(TEST_TYPES);
  const subjects = Object.values(SUBJECTS);
  const difficulties = ['Easy', 'Medium', 'Hard'];
  
  let assessments = [];
  let id = 1;

  dataStructures.forEach(dataStructure => {
    // Generate exactly 10 tests for each data structure
    // Distribute evenly: 3 Coding, 3 Theory, 4 Mixed
    const testTypeDistribution = [
      'Coding Test', 'Coding Test', 'Coding Test',
      'Theory Test', 'Theory Test', 'Theory Test',
      'Mixed Test', 'Mixed Test', 'Mixed Test', 'Mixed Test'
    ];

    for (let i = 0; i < 10; i++) {
      const testType = testTypeDistribution[i];
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
      
      // Generate topics based on data structure
      const topics = generateTopicsForDataStructure(dataStructure);
      
      assessments.push({
        id: id++,
        title: `${dataStructure} ${testType} - ${subject} ${i + 1}`,
        dataStructure,
        subject,
        type: testType,
        difficulty,
        duration: getDuration(difficulty),
        questions: getQuestions(difficulty),
        topics: topics.slice(0, Math.floor(Math.random() * 3) + 3), // 3-5 topics
        description: getDescription(dataStructure, testType, subject),
        instructor: getRandomInstructor(),
        maxAttempts: 3,
        dueDate: getRandomDueDate(),
        createdAt: getRandomCreatedDate()
      });
    }
  });

  return assessments;
};

// Helper functions
const generateTopicsForDataStructure = (dataStructure) => {
  const topicMap = {
    'Arrays': [
      'Array Traversal', 'Sorting Algorithms', 'Binary Search', 'Two Pointers',
      'Dynamic Arrays', 'Multi-dimensional Arrays', 'Array Manipulation',
      'Sliding Window', 'Prefix Sum', 'Array Rotations'
    ],
    'Linked Lists': [
      'Singly Linked List', 'Doubly Linked List', 'Circular Linked List',
      'List Operations', 'Memory Management', 'Reversing Lists',
      'Merging Lists', 'Cycle Detection', 'Fast & Slow Pointers'
    ],
    'Stacks': [
      'Stack Operations', 'Expression Evaluation', 'Parentheses Matching',
      'Function Call Stack', 'Stack Implementation', 'Infix to Postfix',
      'Next Greater Element', 'Stack Sorting', 'Min Stack'
    ],
    'Queues': [
      'Queue Operations', 'Circular Queue', 'Priority Queue', 'Deque',
      'Queue Implementation', 'BFS Applications', 'Level Order Traversal',
      'Sliding Window Maximum', 'Queue using Stacks'
    ],
    'Trees': [
      'Binary Trees', 'Binary Search Trees', 'Tree Traversal', 'AVL Trees',
      'Tree Operations', 'Heap', 'Trie', 'Segment Trees', 'Tree Construction',
      'Lowest Common Ancestor'
    ],
    'Graphs': [
      'Graph Representation', 'Graph Traversal', 'Shortest Path', 'DFS & BFS',
      'Minimum Spanning Tree', 'Graph Algorithms', 'Topological Sort',
      'Strongly Connected Components', 'Dijkstra Algorithm', 'Floyd Warshall'
    ],
    'Hash Tables': [
      'Hash Functions', 'Collision Resolution', 'Hash Table Operations',
      'Hash Map Implementation', 'Performance Analysis', 'Open Addressing',
      'Chaining', 'Hash Set', 'Two Sum Problem', 'Anagram Detection'
    ]
  };
  return topicMap[dataStructure] || ['General Programming', 'Problem Solving'];
};

const getDuration = (difficulty) => {
  const durations = {
    'Easy': ['1 hr', '1.5 hrs', '2 hrs'],
    'Medium': ['2 hrs', '2.5 hrs', '3 hrs'],
    'Hard': ['3 hrs', '3.5 hrs', '4 hrs']
  };
  return durations[difficulty][Math.floor(Math.random() * durations[difficulty].length)];
};

const getQuestions = (difficulty) => {
  const questions = {
    'Easy': ['5 (50 marks)', '6 (60 marks)', '8 (80 marks)'],
    'Medium': ['8 (80 marks)', '10 (100 marks)', '12 (120 marks)'],
    'Hard': ['10 (100 marks)', '12 (120 marks)', '15 (150 marks)']
  };
  return questions[difficulty][Math.floor(Math.random() * questions[difficulty].length)];
};

const getDescription = (dataStructure, testType, subject) => {
  return `Comprehensive ${testType.toLowerCase()} covering ${dataStructure.toLowerCase()} concepts in ${subject}`;
};

const getRandomInstructor = () => {
  const instructors = [
    'Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Davis', 
    'Dr. Brown', 'Prof. Wilson', 'Dr. Martinez', 'Prof. Garcia',
    'Dr. Anderson', 'Prof. Taylor'
  ];
  return instructors[Math.floor(Math.random() * instructors.length)];
};

const getRandomDueDate = () => {
  const today = new Date();
  const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0];
};

const getRandomCreatedDate = () => {
  const today = new Date();
  const pastDate = new Date(today.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
  return pastDate.toISOString().split('T')[0];
};

// Generate all assessments
export const allAssessments = generateAssessments();

// Enhanced user-specific assessment data
export const userAssessmentData = {
  rishika: {
    name: 'Rishika',
    email: 'rishika@example.com',
    stats: {
      totalCourses: { value: '6', change: '+2 this semester' },
      assessments: { value: '12', change: '4 pending' },
      averageGrade: { value: '85%', change: '+5% from last month' },
      studyHours: { value: '24h', change: 'This week' }
    },
    assessmentStatuses: {
      // Arrays (1-10)
      1: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '2/3', score: 92 },
      2: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 65, attempts: '1/3' },
      3: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      4: { status: ASSESSMENT_STATUS.OVERDUE, progress: 25, attempts: '1/3' },
      5: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 88 },
      6: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      7: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 40, attempts: '1/3' },
      8: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      9: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 95 },
      10: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      
      // Linked Lists (11-20)
      11: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 80, attempts: '2/3' },
      12: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      13: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 87 },
      14: { status: ASSESSMENT_STATUS.OVERDUE, progress: 15, attempts: '1/3' },
      15: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      16: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 55, attempts: '1/3' },
      17: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      18: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '2/3', score: 91 },
      19: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      20: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 35, attempts: '1/3' },
      
      // Stacks (21-30)
      21: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 89 },
      22: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      23: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 45, attempts: '1/3' },
      24: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      25: { status: ASSESSMENT_STATUS.OVERDUE, progress: 20, attempts: '1/3' },
      26: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 94 },
      27: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      28: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 60, attempts: '1/3' },
      29: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      30: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '2/3', score: 86 },
      
      // Continue similar pattern for other data structures...
      // Queues (31-40)
      31: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      32: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 30, attempts: '1/3' },
      33: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      34: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 92 },
      35: { status: ASSESSMENT_STATUS.OVERDUE, progress: 10, attempts: '1/3' },
      36: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      37: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 70, attempts: '1/3' },
      38: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      39: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 88 },
      40: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' }
    },
    recentActivities: [
      { course: 'Data Structures', activity: 'Completed Arrays Test', time: '2 hours ago' },
      { course: 'Database Management', activity: 'Started Quiz 2', time: '1 day ago' },
      { course: 'Web Development', activity: 'Submitted Project', time: '2 days ago' }
    ]
  },
  
  riya: {
    name: 'Riya',
    email: 'riya@example.com',
    stats: {
      totalCourses: { value: '5', change: '+1 this semester' },
      assessments: { value: '10', change: '2 pending' },
      averageGrade: { value: '92%', change: '+8% from last month' },
      studyHours: { value: '32h', change: 'This week' }
    },
    assessmentStatuses: {
      // Arrays (1-10)
      1: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 96 },
      2: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 93 },
      3: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 75, attempts: '1/3' },
      4: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      5: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 98 },
      6: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 90, attempts: '1/3' },
      7: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      8: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 94 },
      9: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      10: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 60, attempts: '1/3' },
      
      // Linked Lists (11-20)
      11: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 91 },
      12: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 85, attempts: '1/3' },
      13: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 97 },
      14: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      15: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 89 },
      16: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 65, attempts: '1/3' },
      17: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      18: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '1/3', score: 95 },
      19: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      20: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 40, attempts: '1/3' }
    },
    recentActivities: [
      { course: 'Software Engineering', activity: 'Completed Sprint Planning', time: '1 hour ago' },
      { course: 'Computer Networks', activity: 'Submitted Lab Report', time: '3 hours ago' },
      { course: 'Data Structures', activity: 'Started Linked List Test', time: '5 hours ago' }
    ]
  },
  
  rashee: {
    name: 'Rashee',
    email: 'rashee@example.com',
    stats: {
      totalCourses: { value: '7', change: '+3 this semester' },
      assessments: { value: '15', change: '6 pending' },
      averageGrade: { value: '78%', change: '+2% from last month' },
      studyHours: { value: '18h', change: 'This week' }
    },
    assessmentStatuses: {
      // Arrays (1-10)
      1: { status: ASSESSMENT_STATUS.OVERDUE, progress: 45, attempts: '2/3' },
      2: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      3: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '3/3', score: 76 },
      4: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 30, attempts: '1/3' },
      5: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      6: { status: ASSESSMENT_STATUS.OVERDUE, progress: 60, attempts: '2/3' },
      7: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      8: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '2/3', score: 82 },
      9: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 70, attempts: '1/3' },
      10: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      
      // Linked Lists (11-20)
      11: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      12: { status: ASSESSMENT_STATUS.OVERDUE, progress: 20, attempts: '1/3' },
      13: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '2/3', score: 74 },
      14: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 50, attempts: '1/3' },
      15: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      16: { status: ASSESSMENT_STATUS.COMPLETED, progress: 100, attempts: '3/3', score: 79 },
      17: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      18: { status: ASSESSMENT_STATUS.IN_PROGRESS, progress: 35, attempts: '1/3' },
      19: { status: ASSESSMENT_STATUS.NOT_STARTED, progress: 0, attempts: '0/3' },
      20: { status: ASSESSMENT_STATUS.OVERDUE, progress: 15, attempts: '1/3' }
    },
    recentActivities: [
      { course: 'Artificial Intelligence', activity: 'Submitted Research Paper', time: '30 minutes ago' },
      { course: 'Cybersecurity', activity: 'Completed Penetration Test', time: '4 hours ago' },
      { course: 'Data Structures', activity: 'Started Arrays Test', time: '1 day ago' }
    ]
  }
};

// Helper function to get user-specific assessment data
export const getUserAssessments = (username) => {
  const user = userAssessmentData[username?.toLowerCase()] || userAssessmentData.rishika;
  
  return allAssessments.map(assessment => ({
    ...assessment,
    ...(user.assessmentStatuses[assessment.id] || {
      status: ASSESSMENT_STATUS.NOT_STARTED,
      progress: 0,
      attempts: '0/3'
    })
  }));
};

// Enhanced filtering function
export const filterAssessments = (assessments, filters) => {
  return assessments.filter(assessment => {
    // Search by title, topics, or data structure
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        assessment.title.toLowerCase().includes(searchTerm) ||
        assessment.dataStructure.toLowerCase().includes(searchTerm) ||
        assessment.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
        assessment.subject.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    // Filter by data structure
    if (filters.dataStructure && filters.dataStructure !== 'Choose data structure') {
      if (assessment.dataStructure !== filters.dataStructure) return false;
    }
    
    // Filter by test type
    if (filters.testType && filters.testType !== 'Type of test') {
      if (assessment.type !== filters.testType) return false;
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'All Status') {
      if (assessment.status !== filters.status) return false;
    }
    
    // Filter by difficulty
    if (filters.difficulty && filters.difficulty !== 'All Difficulty') {
      if (assessment.difficulty !== filters.difficulty) return false;
    }
    
    // Filter by subject
    if (filters.subject && filters.subject !== 'All Subjects') {
      if (assessment.subject !== filters.subject) return false;
    }
    
    return true;
  });
};

// Filter options
export const filterOptions = {
  dataStructures: ['Choose data structure', ...Object.values(DATA_STRUCTURES)],
  testTypes: ['Type of test', ...Object.values(TEST_TYPES)],
  subjects: ['All Subjects', ...Object.values(SUBJECTS)],
  status: ['All Status', ...Object.values(ASSESSMENT_STATUS)],
  difficulty: ['All Difficulty', 'Easy', 'Medium', 'Hard']
};

// Statistics calculation
export const calculateUserStats = (username) => {
  const userAssessments = getUserAssessments(username);
  const user = userAssessmentData[username?.toLowerCase()] || userAssessmentData.rishika;
  
  const completed = userAssessments.filter(a => a.status === ASSESSMENT_STATUS.COMPLETED);
  const overdue = userAssessments.filter(a => a.status === ASSESSMENT_STATUS.OVERDUE);
  const inProgress = userAssessments.filter(a => a.status === ASSESSMENT_STATUS.IN_PROGRESS);
  const notStarted = userAssessments.filter(a => a.status === ASSESSMENT_STATUS.NOT_STARTED);
  
  const completedScores = completed.filter(a => a.score).map(a => a.score);
  const averageScore = completedScores.length > 0 
    ? Math.round(completedScores.reduce((a, b) => a + b, 0) / completedScores.length)
    : 0;
  
  const highestScore = completedScores.length > 0 ? Math.max(...completedScores) : 0;
  
  return {
    completed: {
      count: completed.length,
      total: userAssessments.length,
      percentage: Math.round((completed.length / userAssessments.length) * 100)
    },
    averageScore: {
      current: averageScore,
      highest: highestScore
    },
    overdue: {
      count: overdue.length
    },
    inProgress: {
      count: inProgress.length
    },
    notStarted: {
      count: notStarted.length
    }
  };
};

// Utility functions
export const getStatusColor = (status) => {
  const statusColors = {
    [ASSESSMENT_STATUS.NOT_STARTED]: 'gray',
    [ASSESSMENT_STATUS.IN_PROGRESS]: 'blue',
    [ASSESSMENT_STATUS.COMPLETED]: 'green',
    [ASSESSMENT_STATUS.OVERDUE]: 'red'
  };
  return statusColors[status] || 'gray';
};

export const getDifficultyColor = (difficulty) => {
  const difficultyColors = {
    'Easy': 'green',
    'Medium': 'yellow',
    'Hard': 'red'
  };
  return difficultyColors[difficulty] || 'gray';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getProgressVariant = (progress) => {
  if (progress >= 80) return 'success';
  if (progress >= 50) return 'default';
  if (progress >= 20) return 'warning';
  return 'danger';
};

export default {
  allAssessments,
  userAssessmentData,
  getUserAssessments,
  filterAssessments,
  calculateUserStats,
  filterOptions,
  ASSESSMENT_STATUS,
  TEST_TYPES,
  SUBJECTS,
  DATA_STRUCTURES,
  getStatusColor,
  getDifficultyColor,
  formatDate,
  getProgressVariant
};