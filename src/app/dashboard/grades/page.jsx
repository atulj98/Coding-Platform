// grade
'use client';
import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState('current');

  const overallStats = {
    gpa: 8.5,
    totalCredits: 120,
    completedCredits: 90,
    rank: 12
  };

  const semesterGrades = [
    {
      semester: 'Semester 6 (Current)',
      courses: [
        { code: 'CS601', name: 'Data Structures and Algorithms', credits: 4, grade: 'A', points: 9, status: 'In Progress' },
        { code: 'CS602', name: 'Database Management Systems', credits: 3, grade: 'A+', points: 10, status: 'Completed' },
        { code: 'CS603', name: 'Web Development', credits: 3, grade: 'B+', points: 8, status: 'In Progress' },
        { code: 'CS604', name: 'Operating Systems', credits: 4, grade: '-', points: 0, status: 'Not Started' },
        { code: 'CS605', name: 'Machine Learning', credits: 3, grade: 'B', points: 7, status: 'In Progress' }
      ]
    },
    {
      semester: 'Semester 5',
      courses: [
        { code: 'CS501', name: 'Software Engineering', credits: 4, grade: 'A', points: 9, status: 'Completed' },
        { code: 'CS502', name: 'Computer Networks', credits: 3, grade: 'A+', points: 10, status: 'Completed' },
        { code: 'CS503', name: 'Compiler Design', credits: 3, grade: 'A', points: 9, status: 'Completed' },
        { code: 'CS504', name: 'Artificial Intelligence', credits: 4, grade: 'B+', points: 8, status: 'Completed' },
        { code: 'CS505', name: 'Mobile App Development', credits: 3, grade: 'A', points: 9, status: 'Completed' }
      ]
    }
  ];

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-100',
      'A': 'text-green-600 bg-green-100',
      'B+': 'text-blue-600 bg-blue-100',
      'B': 'text-blue-600 bg-blue-100',
      'C+': 'text-yellow-600 bg-yellow-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'F': 'text-red-600 bg-red-100',
      '-': 'text-gray-600 bg-gray-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'text-green-600 bg-green-100',
      'In Progress': 'text-blue-600 bg-blue-100',
      'Not Started': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  const calculateSemesterGPA = (courses) => {
    const completedCourses = courses.filter(course => course.points > 0);
    if (completedCourses.length === 0) return 0;
    
    const totalPoints = completedCourses.reduce((sum, course) => sum + (course.points * course.credits), 0);
    const totalCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
    
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Academic Performance</h1>
        </div>
        <p className="text-gray-600">Track your grades and academic progress throughout your studies.</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.gpa}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credits Completed</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.completedCredits}/{overallStats.totalCredits}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Class Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{overallStats.rank}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round((overallStats.completedCredits / overallStats.totalCredits) * 100)}%</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Semester Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Semester Grades</h2>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Semester</option>
            <option value="previous">Previous Semester</option>
          </select>
        </div>

        {/* Semester Grades Table */}
        {semesterGrades.map((semester, index) => (
          <div key={index} className={`${selectedSemester === 'current' && index === 0 ? 'block' : selectedSemester === 'previous' && index === 1 ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{semester.semester}</h3>
              <div className="text-sm text-gray-600">
                Semester GPA: <span className="font-bold text-gray-900">{calculateSemesterGPA(semester.courses)}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Course Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Course Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Credits</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Grade</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, courseIndex) => (
                    <tr key={courseIndex} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{course.code}</td>
                      <td className="py-3 px-4 text-gray-700">{course.name}</td>
                      <td className="py-3 px-4 text-gray-700">{course.credits}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={course.status} />
                      </td>
                      <td className="py-3 px-4 text-gray-700">{course.points}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Grade Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-green-600">A+ & A Grades</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <div className="text-sm text-blue-600">B+ & B Grades</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-yellow-600">C+ & C Grades</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-sm text-red-600">F Grades</div>
          </div>
        </div>
      </div>
    </div>
  );
}