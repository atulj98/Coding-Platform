// lib/data/mockUserProfiles.js

export const userProfileData = {
  rishika: {
    name: 'Rishika Sharma',
    email: 'rishika@example.com',
    phone: '+91 9876543210',
    location: 'Delhi, India',
    joinDate: 'January 2024',
    bio: 'Passionate computer science student with a love for problem-solving and creating innovative solutions.',
    university: 'Sharda University',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    skills: ['Java', 'Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
    achievements: [
      'Top 10% in Data Structures Course',
      'Completed 50+ Coding Challenges',
      "Dean's List - Fall 2023"
    ],
    stats: {
      assessmentsCompleted: 12,
      totalAssessments: 30,
      averageScore: 85,
      overdueTasks: 1
    }
  },
  
  riya: {
    name: 'Riya Patel',
    email: 'riya@example.com',
    phone: '+91 9876543211',
    location: 'Mumbai, India',
    joinDate: 'February 2024',
    bio: 'Dedicated software engineering student with expertise in full-stack development and machine learning.',
    university: 'Sharda University',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    skills: ['Python', 'React', 'Node.js', 'MongoDB', 'TensorFlow', 'Docker'],
    achievements: [
      'Best Project Award - Web Development',
      'Hackathon Winner 2024',
      'Google Code-in Participant',
      'Top 5% in Machine Learning Course'
    ],
    stats: {
      assessmentsCompleted: 18,
      totalAssessments: 30,
      averageScore: 92,
      overdueTasks: 0
    }
  },
  
  rashee: {
    name: 'Rashee Gupta',
    email: 'rashee@example.com',
    phone: '+91 9876543212',
    location: 'Bangalore, India',
    joinDate: 'March 2024',
    bio: 'Aspiring data scientist with a strong foundation in algorithms and statistical analysis.',
    university: 'Sharda University',
    course: 'B.Tech Computer Science',
    semester: '6th Semester',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Pandas', 'Scikit-learn'],
    achievements: [
      'Data Science Competition - 2nd Place',
      'Research Paper Published',
      'Top 15% in Database Management'
    ],
    stats: {
      assessmentsCompleted: 15,
      totalAssessments: 30,
      averageScore: 88,
      overdueTasks: 2
    }
  }
};

// Helper function to get user profile data
export function getUserProfile(username) {
  return userProfileData[username?.toLowerCase()] || userProfileData.rishika;
}

// Helper function to update user profile data (for edit functionality)
export function updateUserProfile(username, updatedData) {
  const currentUser = username?.toLowerCase() || 'rishika';
  if (userProfileData[currentUser]) {
    userProfileData[currentUser] = { ...userProfileData[currentUser], ...updatedData };
    return userProfileData[currentUser];
  }
  return null;
}

// Helper function to get user initials for avatar
export function getUserInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Default export
const mockUserProfiles = {
  userProfileData,
  getUserProfile,
  updateUserProfile,
  getUserInitials
};

export default mockUserProfiles;