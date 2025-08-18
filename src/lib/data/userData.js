// lib/data/userData.js
export const userData = {
  rishika: {
    name: 'Rishika',
    stats: {
      totalCourses: {
        value: '6',
        change: '+2 this semester'
      },
      assessments: {
        value: '12',
        change: '4 pending'
      },
      averageGrade: {
        value: '85%',
        change: '+5% from last month'
      },
      studyHours: {
        value: '24h',
        change: 'This week'
      }
    },
    recentActivities: [
      { course: 'Data Structures', activity: 'Completed Assignment 3', time: '2 hours ago' },
      { course: 'Database Management', activity: 'Started Quiz 2', time: '1 day ago' },
      { course: 'Web Development', activity: 'Submitted Project', time: '2 days ago' },
      { course: 'Operating Systems', activity: 'Attended Lab Session', time: '3 days ago' },
      { course: 'Machine Learning', activity: 'Reviewed Lecture Notes', time: '4 days ago' }
    ]
  },
  riya: {
    name: 'Riya',
    stats: {
      totalCourses: {
        value: '5',
        change: '+1 this semester'
      },
      assessments: {
        value: '10',
        change: '2 pending'
      },
      averageGrade: {
        value: '92%',
        change: '+8% from last month'
      },
      studyHours: {
        value: '32h',
        change: 'This week'
      }
    },
    recentActivities: [
      { course: 'Software Engineering', activity: 'Completed Sprint Planning', time: '1 hour ago' },
      { course: 'Computer Networks', activity: 'Submitted Lab Report', time: '3 hours ago' },
      { course: 'Database Management', activity: 'Completed Quiz 2', time: '1 day ago' },
      { course: 'Web Development', activity: 'Started Final Project', time: '2 days ago' },
      { course: 'Data Structures', activity: 'Attended Tutorial', time: '3 days ago' }
    ]
  },
  rashee: {
    name: 'Rashee',
    stats: {
      totalCourses: {
        value: '7',
        change: '+3 this semester'
      },
      assessments: {
        value: '15',
        change: '6 pending'
      },
      averageGrade: {
        value: '78%',
        change: '+2% from last month'
      },
      studyHours: {
        value: '18h',
        change: 'This week'
      }
    },
    recentActivities: [
      { course: 'Artificial Intelligence', activity: 'Submitted Research Paper', time: '30 minutes ago' },
      { course: 'Cybersecurity', activity: 'Completed Penetration Test', time: '4 hours ago' },
      { course: 'Mobile Development', activity: 'Deployed App to TestFlight', time: '1 day ago' },
      { course: 'Cloud Computing', activity: 'Configured AWS Services', time: '2 days ago' },
      { course: 'Database Management', activity: 'Optimized Query Performance', time: '3 days ago' }
    ]
  }
};

// Helper function to get user data
export const getUserData = (username) => {
  return userData[username?.toLowerCase()] || userData.rishika; // Default to rishika if user not found
};