'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Add this import
import { BookOpenIcon, ClockIcon, UserIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/context/AuthContext'; // Import the auth context
import { 
  getUserCourses, 
  filterCoursesByStatus, 
  getUserCourseStats,
  getStatusColor,
  formatDate,
  COURSE_STATUS 
} from '@/lib/data/courses';

export default function CoursesPage() { // Remove the hardcoded currentUser prop
  const { user } = useAuth(); // Get the current user from auth context
  const router = useRouter(); // Add router for navigation
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Use the logged-in user's username, fallback to 'rishika' if no user
  const currentUser = user?.username || 'rishika';

  // Get user-specific data using the actual logged-in user
  const userCourses = getUserCourses(currentUser);
  const filteredCourses = filterCoursesByStatus(currentUser, selectedFilter);
  const stats = getUserCourseStats(currentUser);

  const getStatusBadge = (status) => {
    return `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`;
  };

  const getNextClassText = (course) => {
    if (course.status === COURSE_STATUS.COMPLETED) {
      return `Completed on ${formatDate(course.completedDate)}`;
    }
    if (course.status === COURSE_STATUS.NOT_STARTED) {
      return `Starts ${formatDate(course.startDate)}`;
    }
    if (!course.isActive) {
      return `Starts ${formatDate(course.startDate)}`;
    }
    return `Next: ${course.nextClass}`;
  };

  const getButtonText = (course) => {
    switch (course.status) {
      case COURSE_STATUS.COMPLETED:
        return 'Review';
      case COURSE_STATUS.NOT_STARTED:
        return course.isActive ? 'Start Course' : 'View Details';
      case COURSE_STATUS.UPCOMING:
        return 'View Details';
      default:
        return 'Continue';
    }
  };

  const getButtonStyle = (course) => {
    if (course.status === COURSE_STATUS.COMPLETED) {
      return 'px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors';
    }
    if (!course.isActive || course.status === COURSE_STATUS.UPCOMING) {
      return 'px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors';
    }
    return 'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors';
  };

  // Add function to handle button clicks
  const handleCourseButtonClick = () => {
    router.push('/coming-soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpenIcon className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
        </div>
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold capitalize">{user?.displayName || currentUser}</span>! 
          Track your learning progress and access course materials.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.enrolled}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <PlayIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedFilter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            My Courses ({stats.enrolled})
          </button>
          <button
            onClick={() => setSelectedFilter('in-progress')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedFilter === 'in-progress' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            onClick={() => setSelectedFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedFilter === 'completed' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed ({stats.completed})
          </button>
          <button
            onClick={() => setSelectedFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedFilter === 'upcoming' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upcoming ({stats.upcoming})
          </button>
        </div>

        {/* Filter Description */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {selectedFilter === 'all' && `Showing all ${stats.enrolled} courses you're enrolled in.`}
            {selectedFilter === 'in-progress' && `Showing ${stats.inProgress} courses currently in progress.`}
            {selectedFilter === 'completed' && `Showing ${stats.completed} completed courses with certificates earned.`}
            {selectedFilter === 'upcoming' && `Showing ${stats.upcoming} upcoming courses and courses not yet started.`}
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {selectedFilter === 'all' && "You haven't enrolled in any courses yet."}
              {selectedFilter === 'in-progress' && "No courses are currently in progress."}
              {selectedFilter === 'completed' && "No courses have been completed yet."}
              {selectedFilter === 'upcoming' && "No upcoming courses are available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${course.color}`}>
                    <BookOpenIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={getStatusBadge(course.status)}>
                      {course.status}
                    </span>
                    {course.certificateEarned && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Certificate
                      </span>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {course.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {course.instructor}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {course.duration} • {course.totalLessons} lessons
                  </div>
                  {course.enrolled && course.progress > 0 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="h-4 w-4 mr-2">📚</span>
                      Lesson {course.currentLesson} of {course.totalLessons}
                    </div>
                  )}
                  {course.grade && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="h-4 w-4 mr-2">🎓</span>
                      Grade: {course.grade}
                    </div>
                  )}
                </div>
                
                {course.enrolled && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          course.status === COURSE_STATUS.COMPLETED ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {getNextClassText(course)}
                  </span>
                  <button 
                    onClick={handleCourseButtonClick}
                    className={getButtonStyle(course)}
                  >
                    {getButtonText(course)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Available</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {userCourses.filter(c => c.certificateEarned).length}
            </p>
            <p className="text-sm text-gray-600">Certificates</p>
          </div>
        </div>
      </div> */}
    </div>
  );
}