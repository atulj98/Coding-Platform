'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext'; // Import useAuth hook
import {
  ChevronDown,
  Search,
  Filter,
  Info,
  Play,
  BarChart3,
  AlertCircle,
  Code,
  CircleCheckBig,
  X,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

// Import custom components
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Progress from '@/components/ui/progress';
import Input from '@/components/ui/input';

// Import enhanced data
import { 
  getUserAssessments,
  filterAssessments,
  calculateUserStats,
  filterOptions,
  getStatusColor,
  getDifficultyColor,
  getProgressVariant,
  formatDate,
  ASSESSMENT_STATUS,
  TEST_TYPES,
  DATA_STRUCTURES 
} from '@/lib/data/assessments';

export default function AssessmentsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Get current user from AuthContext
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dataStructureFilter, setDataStructureFilter] = useState('Choose data structure');
  const [testTypeFilter, setTestTypeFilter] = useState('Type of test');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [difficultyFilter, setDifficultyFilter] = useState('All Difficulty');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  // Get current user's username
  const currentUser = user.username;
  
  // Get user assessments and stats
  const userAssessments = getUserAssessments(currentUser);
  const userStats = calculateUserStats(currentUser);
  
  // Filter assessments based on current filters
  const filteredAssessments = useMemo(() => {
    return filterAssessments(userAssessments, {
      search: searchQuery,
      dataStructure: dataStructureFilter,
      testType: testTypeFilter,
      status: statusFilter,
      difficulty: difficultyFilter,
      subject: subjectFilter
    });
  }, [userAssessments, searchQuery, dataStructureFilter, testTypeFilter, statusFilter, difficultyFilter, subjectFilter]);
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case ASSESSMENT_STATUS.COMPLETED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case ASSESSMENT_STATUS.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-500" />;
      case ASSESSMENT_STATUS.OVERDUE:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <CircleCheckBig className="w-4 h-4 text-gray-400" />;
    }
  };

  // Handle action button clicks - UPDATED
  const handleActionClick = (assessment) => {
    switch (assessment.status) {
      case ASSESSMENT_STATUS.NOT_STARTED:
        // Navigate to test page for starting a new test
        router.push('/test');
        break;
      case ASSESSMENT_STATUS.IN_PROGRESS:
        // Navigate to test page to continue
        router.push('/test');
        break;
      case ASSESSMENT_STATUS.COMPLETED:
        // Navigate to results or coming soon page
        router.push('/coming-soon'); // You can change this to results page later
        break;
      case ASSESSMENT_STATUS.OVERDUE:
        // Navigate to test page to continue overdue test
        router.push('/test');
        break;
      default:
        router.push('/coming-soon');
    }
  };

  const getActionButton = (assessment) => {
    const { status, progress } = assessment;
    
    switch (status) {
      case ASSESSMENT_STATUS.IN_PROGRESS:
        return (
          <Button 
            variant="primary" 
            size="default"
            onClick={() => handleActionClick(assessment)}
          >
            Continue
          </Button>
        );
      case ASSESSMENT_STATUS.COMPLETED:
        return (
          <Button 
            variant="primary" // Changed to primary (blue) as requested
            size="default"
            onClick={() => handleActionClick(assessment)}
          >
            View Results
          </Button>
        );
      case ASSESSMENT_STATUS.OVERDUE:
        return (
          <Button 
            variant="primary" // Changed to primary (blue) as requested
            size="default"
            onClick={() => handleActionClick(assessment)}
          >
            Continue
          </Button>
        );
      case ASSESSMENT_STATUS.NOT_STARTED:
        return (
          <Button 
            variant="primary" 
            size="default" 
            icon={<Play size={16} />}
            onClick={() => handleActionClick(assessment)}
          >
            Start Test
          </Button>
        );
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDataStructureFilter('Choose data structure');
    setTestTypeFilter('Type of test');
    setStatusFilter('All Status');
    setDifficultyFilter('All Difficulty');
    setSubjectFilter('All Subjects');
  };

  const hasActiveFilters = () => {
    return searchQuery || 
           dataStructureFilter !== 'Choose data structure' ||
           testTypeFilter !== 'Type of test' ||
           statusFilter !== 'All Status' ||
           difficultyFilter !== 'All Difficulty' ||
           subjectFilter !== 'All Subjects';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Available Assessments</h1>
            <p className="text-sm text-gray-500">
              Welcome back, {user.displayName || currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}!
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Completed */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats.completed.count}/{userStats.completed.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CircleCheckBig className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <Progress 
              value={userStats.completed.percentage} 
              variant="success"
              showLabel={false}
            />
          </Card>

          {/* Avg Score */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.averageScore.current}%</p>
                <p className="text-sm text-green-600 font-medium">
                  {userStats.averageScore.highest}% highest
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          {/* In Progress */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.inProgress.count}</p>
                <p className="text-sm text-blue-600 font-medium">Keep Going!</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          {/* Overdue */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.overdue.count}</p>
                <p className="text-sm text-red-600 font-medium">
                  {userStats.overdue.count > 0 ? 'Action Required!' : 'Great!'}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="w-full">
              <Input
                placeholder="Search by test name, topic, or data structure..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 sm:w-5 sm:h-5" />}
                rightIcon={searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">Filters:</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
                {/* Data Structure Filter */}
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 text-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={dataStructureFilter}
                    onChange={(e) => setDataStructureFilter(e.target.value)}
                  >
                    {filterOptions.dataStructures.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Test Type Filter */}
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 text-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={testTypeFilter}
                    onChange={(e) => setTestTypeFilter(e.target.value)}
                  >
                    {filterOptions.testTypes.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 text-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    {filterOptions.status.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Difficulty Filter */}
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 text-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    {filterOptions.difficulty.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>

                {/* Subject Filter */}
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-gray-300 text-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  >
                    {filterOptions.subjects.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {hasActiveFilters() && (
                <Button variant="ghost" onClick={clearFilters} size="sm" className="self-start sm:self-center">
                  Clear All
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="blue" size="sm" className="flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:bg-blue-600 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {dataStructureFilter !== 'Choose data structure' && (
                  <Badge variant="green" size="sm" className="flex items-center gap-1">
                    {dataStructureFilter}
                    <button
                      onClick={() => setDataStructureFilter('Choose data structure')}
                      className="ml-1 hover:bg-green-600 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {testTypeFilter !== 'Type of test' && (
                  <Badge variant="purple" size="sm" className="flex items-center gap-1">
                    {testTypeFilter}
                    <button
                      onClick={() => setTestTypeFilter('Type of test')}
                      className="ml-1 hover:bg-purple-600 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAssessments.length} of {userAssessments.length} assessments
          </p>
        </div>

        {/* Assessment Cards */}
        {filteredAssessments.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
            {hasActiveFilters() && (
              <Button variant="primary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="w-full relative">
                {/* Status Flag */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge 
                    variant={getStatusColor(assessment.status)} 
                    size="sm" 
                    className="flex items-center gap-1"
                  >
                    {getStatusIcon(assessment.status)}
                    {assessment.status}
                  </Badge>
                </div>

                <Card.Header>
                  <div className="flex items-start justify-between pr-20">
                    <div className="flex-1">
                      <Badge variant={getDifficultyColor(assessment.difficulty)} size="sm" className="mb-2">
                        {assessment.difficulty}
                      </Badge>
                      <Button variant="ghost" size="sm" className="p-1 absolute top-4 right-16">
                        <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </Card.Header>

                <Card.Content>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 pr-4">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {assessment.subject} • {assessment.type} • {assessment.dataStructure}
                  </p>

                  {assessment.status === ASSESSMENT_STATUS.IN_PROGRESS && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{assessment.progress}%</span>
                      </div>
                      <Progress 
                        value={assessment.progress} 
                        variant={getProgressVariant(assessment.progress)}
                        size="default"
                      />
                    </div>
                  )}

                  {assessment.status === ASSESSMENT_STATUS.COMPLETED && assessment.score && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">Score Achieved</span>
                        <span className="text-lg font-bold text-green-900">{assessment.score}%</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">{assessment.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Due Date</p>
                      <p className={`text-sm font-medium ${
                        assessment.status === ASSESSMENT_STATUS.OVERDUE 
                          ? 'text-red-600' 
                          : 'text-gray-900'
                      }`}>
                        {formatDate(assessment.dueDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Questions</p>
                      <p className="text-sm font-medium text-gray-900">{assessment.questions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Attempts</p>
                      <p className="text-sm font-medium text-gray-900">{assessment.attempts}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {assessment.topics.slice(0, 4).map((topic, i) => (
                        <Badge key={i} variant="default" size="sm" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {assessment.topics.length > 4 && (
                        <Badge variant="default" size="sm" className="text-xs">
                          +{assessment.topics.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Instructor: {assessment.instructor}
                  </div>
                </Card.Content>

                <Card.Footer>
                  <div className="flex items-center justify-end">
                    {getActionButton(assessment)}
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}