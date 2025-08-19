// // Assessment statuses
// export const ASSESSMENT_STATUS = {
//   NOT_STARTED: 'Not Started',
//   IN_PROGRESS: 'In Progress',
//   COMPLETED: 'Completed',
//   OVERDUE: 'Overdue'
// };

// // Test types
// export const TEST_TYPES = {
//   CODING: 'Coding Test',
//   THEORY: 'Theory Test',
//   MIXED: 'Mixed Test'
// };

// // Data structures
// export const DATA_STRUCTURES = {
//   ARRAYS: 'Arrays',
//   LINKED_LISTS: 'Linked Lists',
//   STACKS: 'Stacks',
//   QUEUES: 'Queues',
//   TREES: 'Trees',
//   GRAPHS: 'Graphs',
//   HASH_TABLES: 'Hash Tables'
// };

// // Subjects
// export const SUBJECTS = {
//   JAVA: 'Java',
//   JAVASCRIPT: 'JavaScript',
//   PYTHON: 'Python',
//   SQL: 'SQL',
//   CPP: 'C++',
//   DSA: 'Data Structures & Algorithms'
// };

// // Topics for different subjects
// export const TOPICS = {
//   JAVA: [
//     'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees',
//     'OOP Concepts', 'Collections', 'Multithreading', 'Exception Handling'
//   ],
//   SQL: [
//     'Joins', 'Subqueries', 'Indexing', 'Normalization', 'Triggers',
//     'Views', 'Stored Procedures', 'Functions'
//   ],
//   PYTHON: [
//     'Lists', 'Dictionaries', 'Classes', 'Modules', 'File Handling',
//     'Lambda Functions', 'Decorators', 'Generators'
//   ],
//   DSA: [
//     'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees',
//     'Graphs', 'Sorting', 'Searching', 'Dynamic Programming'
//   ]
// };

// // Sample assessments data
// export const assessments = [
//   {
//     id: 1,
//     title: 'Data Structures in Java',
//     subject: SUBJECTS.JAVA,
//     type: TEST_TYPES.CODING,
//     status: ASSESSMENT_STATUS.IN_PROGRESS,
//     duration: '3 hrs',
//     dueDate: '2025-07-25',
//     questions: '10(100 marks)',
//     attempts: '1/3',
//     progress: 65,
//     topics: TOPICS.JAVA.slice(0, 5),
//     statusColor: 'blue',
//     difficulty: 'Medium',
//     instructor: 'Dr. Smith',
//     description: 'Comprehensive test covering fundamental data structures implementation in Java'
//   },
//   {
//     id: 2,
//     title: 'Database Management Systems',
//     subject: SUBJECTS.SQL,
//     type: TEST_TYPES.THEORY,
//     status: ASSESSMENT_STATUS.COMPLETED,
//     duration: '2 hrs',
//     dueDate: '2025-07-20',
//     questions: '15(100 marks)',
//     attempts: '2/3',
//     progress: 100,
//     topics: TOPICS.SQL.slice(0, 4),
//     statusColor: 'green',
//     difficulty: 'Hard',
//     instructor: 'Prof. Johnson',
//     score: 92,
//     description: 'Advanced database concepts including optimization and design patterns'
//   },
//   {
//     id: 3,
//     title: 'Python Programming Fundamentals',
//     subject: SUBJECTS.PYTHON,
//     type: TEST_TYPES.MIXED,
//     status: ASSESSMENT_STATUS.OVERDUE,
//     duration: '2.5 hrs',
//     dueDate: '2025-07-15',
//     questions: '12(100 marks)',
//     attempts: '0/3',
//     progress: 0,
//     topics: TOPICS.PYTHON.slice(0, 6),
//     statusColor: 'red',
//     difficulty: 'Easy',
//     instructor: 'Dr. Williams',
//     description: 'Basic to intermediate Python programming concepts and practices'
//   },
//   {
//     id: 4,
//     title: 'Advanced Algorithms',
//     subject: SUBJECTS.DSA,
//     type: TEST_TYPES.CODING,
//     status: ASSESSMENT_STATUS.NOT_STARTED,
//     duration: '4 hrs',
//     dueDate: '2025-07-30',
//     questions: '8(100 marks)',
//     attempts: '0/3',
//     progress: 0,
//     topics: TOPICS.DSA.slice(5, 9),
//     statusColor: 'gray',
//     difficulty: 'Hard',
//     instructor: 'Prof. Davis',
//     description: 'Complex algorithmic problems requiring advanced problem-solving skills'
//   },
//   {
//     id: 5,
//     title: 'Web Development with JavaScript',
//     subject: SUBJECTS.JAVASCRIPT,
//     type: TEST_TYPES.CODING,
//     status: ASSESSMENT_STATUS.IN_PROGRESS,
//     duration: '3 hrs',
//     dueDate: '2025-07-28',
//     questions: '10(100 marks)',
//     attempts: '1/3',
//     progress: 35,
//     topics: ['DOM Manipulation', 'Event Handling', 'AJAX', 'ES6+', 'Promises'],
//     statusColor: 'blue',
//     difficulty: 'Medium',
//     instructor: 'Dr. Brown',
//     description: 'Modern JavaScript development techniques and best practices'
//   },
//   {
//     id: 6,
//     title: 'Object-Oriented Programming',
//     subject: SUBJECTS.CPP,
//     type: TEST_TYPES.THEORY,
//     status: ASSESSMENT_STATUS.COMPLETED,
//     duration: '2 hrs',
//     dueDate: '2025-07-18',
//     questions: '15(100 marks)',
//     attempts: '1/3',
//     progress: 100,
//     topics: ['Classes', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
//     statusColor: 'green',
//     difficulty: 'Medium',
//     instructor: 'Prof. Wilson',
//     score: 88,
//     description: 'Core OOP principles and their implementation in C++'
//   }
// ];

// // Statistics data
// export const statistics = {
//   completed: {
//     count: 12,
//     total: 30,
//     percentage: 40
//   },
//   averageScore: {
//     current: 85,
//     highest: 98,
//     trend: 'up'
//   },
//   overdue: {
//     count: 1,
//     urgent: true
//   },
//   totalTime: {
//     studied: '45 hrs',
//     remaining: '23 hrs'
//   }
// };

// // Filter options
// export const filterOptions = {
//   dataStructures: Object.values(DATA_STRUCTURES),
//   testTypes: Object.values(TEST_TYPES),
//   subjects: Object.values(SUBJECTS),
//   status: Object.values(ASSESSMENT_STATUS),
//   difficulty: ['Easy', 'Medium', 'Hard']
// };

// // Utility functions
// export const getStatusColor = (status) => {
//   const statusColors = {
//     [ASSESSMENT_STATUS.NOT_STARTED]: 'gray',
//     [ASSESSMENT_STATUS.IN_PROGRESS]: 'blue',
//     [ASSESSMENT_STATUS.COMPLETED]: 'green',
//     [ASSESSMENT_STATUS.OVERDUE]: 'red'
//   };
//   return statusColors[status] || 'gray';
// };

// export const getDifficultyColor = (difficulty) => {
//   const difficultyColors = {
//     'Easy': 'green',
//     'Medium': 'yellow',
//     'Hard': 'red'
//   };
//   return difficultyColors[difficulty] || 'gray';
// };

// export const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   });
// };

// export const getProgressVariant = (progress) => {
//   if (progress >= 80) return 'success';
//   if (progress >= 50) return 'default';
//   if (progress >= 20) return 'warning';
//   return 'danger';
// };

// // Sample courses data
// export const courses = [
//   {
//     id: 1,
//     name: 'Data Structures & Algorithms',
//     code: 'CS101',
//     instructor: 'Dr. Smith',
//     credits: 4,
//     assessments: [1, 4, 5]
//   },
//   {
//     id: 2,
//     name: 'Database Systems',
//     code: 'CS201',
//     instructor: 'Prof. Johnson',
//     credits: 3,
//     assessments: [2]
//   },
//   {
//     id: 3,
//     name: 'Programming Languages',
//     code: 'CS301',
//     instructor: 'Dr. Williams',
//     credits: 3,
//     assessments: [3, 6]
//   }
// ];

// export default {
//   assessments,
//   statistics,
//   filterOptions,
//   courses,
//   ASSESSMENT_STATUS,
//   TEST_TYPES,
//   SUBJECTS,
//   TOPICS,
//   getStatusColor,
//   getDifficultyColor,
//   formatDate,
//   getProgressVariant
// };