'use client';
import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, X, Camera, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserProfile, updateUserProfile, getUserInitials } from '@/lib/data/mockUserProfiles';

export default function EditProfilePage({ currentUser = 'rishika' }) {
  const router = useRouter();
  const originalProfileData = getUserProfile(currentUser);
  const [editData, setEditData] = useState({ ...originalProfileData });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user profile data
      const updatedProfile = updateUserProfile(currentUser, editData);
      
      if (updatedProfile) {
        // Redirect back to profile page
        router.push('/dashboard/profile');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data and go back
    setEditData({ ...originalProfileData });
    router.push('/dashboard/profile');
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditData(prev => ({ ...prev, skills: skillsArray }));
  };

  const handleAchievementsChange = (value) => {
    const achievementsArray = value.split('\n').map(achievement => achievement.trim()).filter(achievement => achievement);
    setEditData(prev => ({ ...prev, achievements: achievementsArray }));
  };

  const handleGoBack = () => {
    router.push('/dashboard/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                onClick={handleGoBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600">Update your account information</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" /> 
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                onClick={handleCancel} 
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
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
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your location"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University</label>
                  <input
                    type="text"
                    value={editData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your university name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <input
                    type="text"
                    value={editData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your course name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
                  <input
                    type="text"
                    value={editData.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter your current semester"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {editData.joinDate}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Join date cannot be modified</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Skills (separate with commas)
                </label>
                <input
                  type="text"
                  value={editData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="e.g., JavaScript, Python, React"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {editData.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Achievements (one per line)
                </label>
                <textarea
                  value={editData.achievements.join('\n')}
                  onChange={(e) => handleAchievementsChange(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter each achievement on a new line"
                />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Profile Preview */}
            <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-3xl font-bold">
                    {getUserInitials(editData.name)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{editData.name}</h3>
              <p className="text-gray-600">{editData.course}</p>
              <p className="text-sm text-gray-500 mt-1">
                {editData.university} • {editData.semester}
              </p>
            </div>

            {/* Save Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Remember to Save</h3>
              <p className="text-sm text-yellow-700">
                Don't forget to save your changes before leaving this page. 
                All unsaved changes will be lost.
              </p>
            </div>

            {/* Statistics (Read-only) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Statistics</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>Assessments: {editData.stats?.assessmentsCompleted || 0}/{editData.stats?.totalAssessments || 0}</p>
                <p>Average Score: {editData.stats?.averageScore || 0}%</p>
                <p>Overdue Tasks: {editData.stats?.overdueTasks || 0}</p>
                <p className="text-xs text-gray-500 mt-2">Statistics cannot be edited manually</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}