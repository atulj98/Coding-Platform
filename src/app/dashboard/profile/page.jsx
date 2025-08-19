'use client';
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Camera, Award, Code, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { getUserProfile, getUserInitials } from '@/lib/data/mockUserProfiles';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  // Show loading state while auth is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  // Get the profile data for the currently logged-in user
  const profileData = getUserProfile(user.username);

  const handleEditProfile = () => {
    router.push('/dashboard/profile/edit');
  };

  const handleNavigateToAssessments = () => router.push('/dashboard/assessments');
  const handleNavigateToCourses = () => router.push('/dashboard/courses');
  const handleNavigateToGrades = () => router.push('/dashboard/grades');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">View your account information</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleEditProfile} 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <p className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="flex items-center text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <p className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <p className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.location}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <p className="text-gray-900">{profileData.bio}</p>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <p className="text-gray-900">{profileData.university}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <p className="text-gray-900">{profileData.course}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <p className="text-gray-900">{profileData.semester}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <p className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
              <div className="space-y-3">
                {profileData.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center">
                    <Award className="w-4 h-4 mr-3 text-yellow-500" />
                    <span className="text-gray-900">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Profile Avatar */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {getUserInitials(profileData.name)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{profileData.name}</h3>
              <p className="text-gray-600">{profileData.course}</p>
              <p className="text-sm text-gray-500 mt-1">
                {profileData.university} • {profileData.semester}
              </p>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="text-gray-700">Assessments Completed</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {profileData.stats.assessmentsCompleted}/{profileData.stats.totalAssessments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-gray-700">Average Score</span>
                  </div>
                  <span className="font-semibold text-gray-900">{profileData.stats.averageScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                    <span className="text-gray-700">Overdue Tasks</span>
                  </div>
                  <span className={`font-semibold ${profileData.stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {profileData.stats.overdueTasks}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleNavigateToAssessments} 
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-900">View Assessments</span>
                </button>
                <button 
                  onClick={handleNavigateToGrades} 
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-900">Check Grades</span>
                </button>
                <button 
                  onClick={handleNavigateToCourses} 
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-900">View Courses</span>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}