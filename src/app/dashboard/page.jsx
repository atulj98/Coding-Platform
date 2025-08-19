'use client';

import { BookOpenIcon, DocumentCheckIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserData } from '@/lib/data/userData';
import { commonDeadlines } from '@/lib/data/commonData';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userDashboardData, setUserDashboardData] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      const userData = getUserData(user.username);
      setUserDashboardData(userData);
    }
  }, [user, isAuthenticated, isLoading, router]);

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!userDashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Courses',
      value: userDashboardData.stats.totalCourses.value,
      icon: BookOpenIcon,
      color: 'bg-blue-500',
      change: userDashboardData.stats.totalCourses.change
    },
    {
      name: 'Assessments',
      value: userDashboardData.stats.assessments.value,
      icon: DocumentCheckIcon,
      color: 'bg-green-500',
      change: userDashboardData.stats.assessments.change
    },
    {
      name: 'Average Grade',
      value: userDashboardData.stats.averageGrade.value,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      change: userDashboardData.stats.averageGrade.change
    },
    {
      name: 'Study Hours',
      value: userDashboardData.stats.studyHours.value,
      icon: ClockIcon,
      color: 'bg-orange-500',
      change: userDashboardData.stats.studyHours.change
    }
  ];

  const handleNavigateToAssessments = () => {
    router.push('/dashboard/assessments');
  };

  const handleNavigateToCourses = () => {
    router.push('/dashboard/courses');
  };

  const handleNavigateToGrades = () => {
    router.push('/dashboard/grades');
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userDashboardData.name}!
            </h1>
            <p className="text-gray-600">Here's what's happening with your studies today.</p>
          </div>
          
          {/* User Info Display */}
          {/* <div className="text-right">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="text-lg font-semibold text-gray-900">{user.displayName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {userDashboardData.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.course}</p>
                  <p className="text-sm text-gray-600">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines (Common for all users) */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            {commonDeadlines.slice(0, 5).map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{deadline.course}</p>
                  <p className="text-sm text-gray-600">{deadline.task}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{deadline.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={handleNavigateToAssessments}
            className="flex items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <DocumentCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Take Assessment</span>
          </button>
          <button 
            onClick={handleNavigateToCourses}
            className="flex items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <BookOpenIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Browse Courses</span>
          </button>
          <button 
            onClick={handleNavigateToGrades}
            className="flex items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">View Grades</span>
          </button>
        </div>
      </div> */}
    </div>
  );
}