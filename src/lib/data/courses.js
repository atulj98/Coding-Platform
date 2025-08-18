// Course statuses
export const COURSE_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  UPCOMING: 'Upcoming'
};

// Course categories
export const COURSE_CATEGORIES = {
  PROGRAMMING: 'Programming',
  DATA_SCIENCE: 'Data Science',
  WEB_DEVELOPMENT: 'Web Development',
  MOBILE_DEVELOPMENT: 'Mobile Development',
  DATABASE: 'Database',
  CYBERSECURITY: 'Cybersecurity',
  AI_ML: 'AI & Machine Learning',
  SYSTEM_DESIGN: 'System Design'
};

// All available courses (same for all users)
export const allCourses = [
  {
    id: 1,
    title: 'Data Structures and Algorithms',
    instructor: 'Dr. Priya Sharma',
    duration: '16 weeks',
    category: COURSE_CATEGORIES.PROGRAMMING,
    description: 'Master fundamental data structures and algorithms essential for programming.',
    color: 'bg-blue-500',
    startDate: '2025-01-15',
    endDate: '2025-05-15',
    totalLessons: 48,
    difficulty: 'Intermediate',
    prerequisites: ['Basic Programming'],
    syllabus: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Dynamic Programming'],
    enrolled: 145,
    rating: 4.8,
    nextClass: '2025-05-15',
    isActive: true
  },
  {
    id: 2,
    title: 'Database Management Systems',
    instructor: 'Prof. Rajesh Kumar',
    duration: '14 weeks',
    category: COURSE_CATEGORIES.DATABASE,
    description: 'Learn database design, SQL, and database administration.',
    color: 'bg-green-500',
    startDate: '2025-01-20',
    endDate: '2025-04-25',
    totalLessons: 42,
    difficulty: 'Beginner',
    prerequisites: [],
    syllabus: ['Database Concepts', 'SQL Basics', 'Normalization', 'Indexing', 'Transactions', 'NoSQL'],
    enrolled: 138,
    rating: 4.7,
    nextClass: '2025-05-16',
    isActive: true
  },
  {
    id: 3,
    title: 'Web Development Fundamentals',
    instructor: 'Ms. Neha Gupta',
    duration: '12 weeks',
    category: COURSE_CATEGORIES.WEB_DEVELOPMENT,
    description: 'Build modern web applications using HTML, CSS, JavaScript, and React.',
    color: 'bg-purple-500',
    startDate: '2025-02-01',
    endDate: '2025-04-30',
    totalLessons: 36,
    difficulty: 'Beginner',
    prerequisites: [],
    syllabus: ['HTML & CSS', 'JavaScript', 'DOM Manipulation', 'React Basics', 'State Management', 'API Integration'],
    enrolled: 152,
    rating: 4.9,
    nextClass: '2025-05-16',
    isActive: true
  },
  {
    id: 4,
    title: 'Operating Systems',
    instructor: 'Dr. Amit Singh',
    duration: '15 weeks',
    category: COURSE_CATEGORIES.SYSTEM_DESIGN,
    description: 'Understanding operating system concepts and implementation.',
    color: 'bg-orange-500',
    startDate: '2025-05-20',
    endDate: '2025-08-30',
    totalLessons: 45,
    difficulty: 'Advanced',
    prerequisites: ['Computer Architecture', 'C Programming'],
    syllabus: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization', 'Deadlocks', 'Security'],
    enrolled: 141,
    rating: 4.6,
    nextClass: '2025-05-20',
    isActive: false
  },
  {
    id: 5,
    title: 'Machine Learning Basics',
    instructor: 'Prof. Sunita Rani',
    duration: '18 weeks',
    category: COURSE_CATEGORIES.AI_ML,
    description: 'Introduction to machine learning algorithms and applications.',
    color: 'bg-pink-500',
    startDate: '2025-02-10',
    endDate: '2025-06-15',
    totalLessons: 54,
    difficulty: 'Intermediate',
    prerequisites: ['Statistics', 'Python Programming'],
    syllabus: ['Supervised Learning', 'Unsupervised Learning', 'Neural Networks', 'Deep Learning', 'Model Evaluation', 'Real-world Projects'],
    enrolled: 135,
    rating: 4.8,
    nextClass: '2025-05-18',
    isActive: true
  },
  {
    id: 6,
    title: 'Software Engineering',
    instructor: 'Mr. Vikram Joshi',
    duration: '16 weeks',
    category: COURSE_CATEGORIES.PROGRAMMING,
    description: 'Learn software development methodologies and best practices.',
    color: 'bg-indigo-500',
    startDate: '2025-06-01',
    endDate: '2025-09-15',
    totalLessons: 48,
    difficulty: 'Intermediate',
    prerequisites: ['Object-Oriented Programming'],
    syllabus: ['SDLC', 'Agile Methodologies', 'Design Patterns', 'Testing', 'Version Control', 'DevOps'],
    enrolled: 148,
    rating: 4.7,
    nextClass: '2025-06-01',
    isActive: false
  },
  {
    id: 7,
    title: 'Cybersecurity Fundamentals',
    instructor: 'Dr. Kavita Mehta',
    duration: '14 weeks',
    category: COURSE_CATEGORIES.CYBERSECURITY,
    description: 'Comprehensive introduction to cybersecurity principles and practices.',
    color: 'bg-red-500',
    startDate: '2025-03-01',
    endDate: '2025-06-01',
    totalLessons: 42,
    difficulty: 'Beginner',
    prerequisites: ['Basic Networking'],
    syllabus: ['Security Fundamentals', 'Cryptography', 'Network Security', 'Web Security', 'Incident Response', 'Ethical Hacking'],
    enrolled: 127,
    rating: 4.6,
    nextClass: '2025-05-17',
    isActive: true
  },
  {
    id: 8,
    title: 'Mobile App Development',
    instructor: 'Mr. Arjun Patel',
    duration: '20 weeks',
    category: COURSE_CATEGORIES.MOBILE_DEVELOPMENT,
    description: 'Build native and cross-platform mobile applications.',
    color: 'bg-teal-500',
    startDate: '2025-07-01',
    endDate: '2025-11-15',
    totalLessons: 60,
    difficulty: 'Intermediate',
    prerequisites: ['JavaScript', 'Object-Oriented Programming'],
    syllabus: ['React Native', 'Flutter', 'Native iOS', 'Native Android', 'App Store Deployment', 'Performance Optimization'],
    enrolled: 118,
    rating: 4.5,
    nextClass: '2025-07-01',
    isActive: false
  },
  {
    id: 9,
    title: 'Cloud Computing with AWS',
    instructor: 'Ms. Pooja Singh',
    duration: '12 weeks',
    category: COURSE_CATEGORIES.SYSTEM_DESIGN,
    description: 'Master cloud services and deployment strategies using Amazon Web Services.',
    color: 'bg-yellow-500',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    totalLessons: 36,
    difficulty: 'Intermediate',
    prerequisites: ['Linux Basics', 'Networking'],
    syllabus: ['EC2 & VPC', 'S3 & Storage', 'RDS & Databases', 'Lambda & Serverless', 'DevOps', 'Security'],
    enrolled: 132,
    rating: 4.7,
    nextClass: '2025-05-19',
    isActive: true
  },
  {
    id: 10,
    title: 'Advanced JavaScript',
    instructor: 'Dr. Rohit Sharma',
    duration: '10 weeks',
    category: COURSE_CATEGORIES.WEB_DEVELOPMENT,
    description: 'Deep dive into advanced JavaScript concepts and modern frameworks.',
    color: 'bg-cyan-500',
    startDate: '2025-08-01',
    endDate: '2025-10-15',
    totalLessons: 30,
    difficulty: 'Advanced',
    prerequisites: ['JavaScript Basics', 'Web Development Fundamentals'],
    syllabus: ['ES6+ Features', 'Async Programming', 'Performance', 'Testing', 'TypeScript', 'Advanced React'],
    enrolled: 95,
    rating: 4.9,
    nextClass: '2025-08-01',
    isActive: false
  }
];

// User-specific course progress data
export const userCourseData = {
  rishika: {
    name: 'Rishika',
    email: 'rishika@example.com',
    courseProgress: {
      1: { // Data Structures and Algorithms
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 75,
        enrolledDate: '2025-01-15',
        lastAccessed: '2025-05-14',
        completedLessons: 36,
        currentLesson: 37,
        grade: null,
        certificateEarned: false
      },
      2: { // Database Management Systems
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-01-20',
        lastAccessed: '2025-04-25',
        completedLessons: 42,
        currentLesson: 42,
        grade: 'A',
        certificateEarned: true,
        completedDate: '2025-04-25'
      },
      3: { // Web Development Fundamentals
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-02-01',
        lastAccessed: '2025-04-30',
        completedLessons: 36,
        currentLesson: 36,
        grade: 'A+',
        certificateEarned: true,
        completedDate: '2025-04-30'
      },
      5: { // Machine Learning Basics
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 30,
        enrolledDate: '2025-02-10',
        lastAccessed: '2025-05-13',
        completedLessons: 16,
        currentLesson: 17,
        grade: null,
        certificateEarned: false
      },
      7: { // Cybersecurity Fundamentals
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 60,
        enrolledDate: '2025-03-01',
        lastAccessed: '2025-05-12',
        completedLessons: 25,
        currentLesson: 26,
        grade: null,
        certificateEarned: false
      },
      9: { // Cloud Computing with AWS
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 45,
        enrolledDate: '2025-04-01',
        lastAccessed: '2025-05-11',
        completedLessons: 16,
        currentLesson: 17,
        grade: null,
        certificateEarned: false
      }
    }
  },
  
  riya: {
    name: 'Riya',
    email: 'riya@example.com',
    courseProgress: {
      1: { // Data Structures and Algorithms
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-01-15',
        lastAccessed: '2025-05-15',
        completedLessons: 48,
        currentLesson: 48,
        grade: 'A+',
        certificateEarned: true,
        completedDate: '2025-05-15'
      },
      2: { // Database Management Systems
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-01-20',
        lastAccessed: '2025-04-25',
        completedLessons: 42,
        currentLesson: 42,
        grade: 'A',
        certificateEarned: true,
        completedDate: '2025-04-25'
      },
      3: { // Web Development Fundamentals
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 85,
        enrolledDate: '2025-02-01',
        lastAccessed: '2025-05-14',
        completedLessons: 31,
        currentLesson: 32,
        grade: null,
        certificateEarned: false
      },
      5: { // Machine Learning Basics
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 55,
        enrolledDate: '2025-02-10',
        lastAccessed: '2025-05-13',
        completedLessons: 30,
        currentLesson: 31,
        grade: null,
        certificateEarned: false
      },
      7: { // Cybersecurity Fundamentals
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-03-01',
        lastAccessed: '2025-06-01',
        completedLessons: 42,
        currentLesson: 42,
        grade: 'B+',
        certificateEarned: true,
        completedDate: '2025-06-01'
      },
      9: { // Cloud Computing with AWS
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 75,
        enrolledDate: '2025-04-01',
        lastAccessed: '2025-05-14',
        completedLessons: 27,
        currentLesson: 28,
        grade: null,
        certificateEarned: false
      }
    }
  },
  
  rashee: {
    name: 'Rashee',
    email: 'rashee@example.com',
    courseProgress: {
      1: { // Data Structures and Algorithms
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 40,
        enrolledDate: '2025-01-15',
        lastAccessed: '2025-05-10',
        completedLessons: 19,
        currentLesson: 20,
        grade: null,
        certificateEarned: false
      },
      2: { // Database Management Systems
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 65,
        enrolledDate: '2025-01-20',
        lastAccessed: '2025-05-13',
        completedLessons: 27,
        currentLesson: 28,
        grade: null,
        certificateEarned: false
      },
      3: { // Web Development Fundamentals
        status: COURSE_STATUS.COMPLETED,
        progress: 100,
        enrolledDate: '2025-02-01',
        lastAccessed: '2025-04-30',
        completedLessons: 36,
        currentLesson: 36,
        grade: 'B',
        certificateEarned: true,
        completedDate: '2025-04-30'
      },
      5: { // Machine Learning Basics
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 20,
        enrolledDate: '2025-02-10',
        lastAccessed: '2025-05-08',
        completedLessons: 11,
        currentLesson: 12,
        grade: null,
        certificateEarned: false
      },
      7: { // Cybersecurity Fundamentals
        status: COURSE_STATUS.IN_PROGRESS,
        progress: 35,
        enrolledDate: '2025-03-01',
        lastAccessed: '2025-05-09',
        completedLessons: 15,
        currentLesson: 16,
        grade: null,
        certificateEarned: false
      }
    }
  }
};

// Helper function to get user-specific courses
export const getUserCourses = (username) => {
  const user = userCourseData[username?.toLowerCase()] || userCourseData.rishika;
  
  return allCourses.map(course => {
    const userProgress = user.courseProgress[course.id];
    
    if (userProgress) {
      return {
        ...course,
        ...userProgress,
        enrolled: true
      };
    } else {
      // User hasn't enrolled in this course
      return {
        ...course,
        status: course.isActive ? COURSE_STATUS.NOT_STARTED : COURSE_STATUS.UPCOMING,
        progress: 0,
        enrolled: false,
        completedLessons: 0,
        currentLesson: 1
      };
    }
  });
};

// Filter courses by status for a specific user
export const filterCoursesByStatus = (username, status) => {
  const userCourses = getUserCourses(username);
  
  switch (status) {
    case 'all':
      return userCourses.filter(course => course.enrolled);
    case 'in-progress':
      return userCourses.filter(course => course.status === COURSE_STATUS.IN_PROGRESS);
    case 'completed':
      return userCourses.filter(course => course.status === COURSE_STATUS.COMPLETED);
    case 'upcoming':
      return userCourses.filter(course => !course.isActive || course.status === COURSE_STATUS.UPCOMING || course.status === COURSE_STATUS.NOT_STARTED);
    default:
      return userCourses;
  }
};

// Get course statistics for a user
export const getUserCourseStats = (username) => {
  const userCourses = getUserCourses(username);
  const enrolledCourses = userCourses.filter(course => course.enrolled);
  
  const totalCourses = allCourses.length;
  const enrolledCount = enrolledCourses.length;
  const completedCount = userCourses.filter(course => course.status === COURSE_STATUS.COMPLETED).length;
  const inProgressCount = userCourses.filter(course => course.status === COURSE_STATUS.IN_PROGRESS).length;
  const upcomingCount = userCourses.filter(course => !course.isActive || course.status === COURSE_STATUS.UPCOMING || course.status === COURSE_STATUS.NOT_STARTED).length;
  
  return {
    total: totalCourses,
    enrolled: enrolledCount,
    completed: completedCount,
    inProgress: inProgressCount,
    upcoming: upcomingCount
  };
};

// Get upcoming courses (same for all users)
export const getUpcomingCourses = () => {
  return allCourses.filter(course => !course.isActive);
};

// Get all courses (same for all users)
export const getAllCourses = () => {
  return allCourses;
};

// Utility functions
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    [COURSE_STATUS.NOT_STARTED]: 'bg-gray-100 text-gray-800',
    [COURSE_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [COURSE_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
    [COURSE_STATUS.UPCOMING]: 'bg-yellow-100 text-yellow-800'
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getDifficultyColor = (difficulty) => {
  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  };
  return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800';
};

export default {
  allCourses,
  userCourseData,
  getUserCourses,
  filterCoursesByStatus,
  getUserCourseStats,
  getUpcomingCourses,
  getAllCourses,
  COURSE_STATUS,
  COURSE_CATEGORIES,
  formatDate,
  getStatusColor,
  getDifficultyColor
};