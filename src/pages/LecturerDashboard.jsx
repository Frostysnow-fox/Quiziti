import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getQuizzes, getQuizAttempts, getUser, toggleQuizStatus, cleanupScoreData } from '../services/database';
import StudentDetailModal from '../components/StudentDetailModal';

const LecturerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalAttempts: 0,
    uniqueStudents: 0,
    averageScore: 0,
    performanceDistribution: {
      excellent: 0,
      good: 0,
      average: 0,
      needsImprovement: 0
    }
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchData();
      
      // Add cleanup function to window for debugging
      window.fixScoreData = handleScoreDataCleanup;
    }
  }, [currentUser?.uid]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch quizzes
      const quizzesResult = await getQuizzes(currentUser.uid);
      if (quizzesResult.success) {
        console.log('Fetched quizzes in dashboard:', quizzesResult.data);
        setQuizzes(quizzesResult.data);
      } else {
        throw new Error(quizzesResult.error);
      }

      // Fetch attempts
      const attemptsResult = await getQuizAttempts(currentUser.uid);
      if (attemptsResult.success) {
        setAttempts(attemptsResult.data);
      } else {
        throw new Error(attemptsResult.error);
      }

      // Calculate analytics
      calculateAnalytics(quizzesResult.data, attemptsResult.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (quizzesData, attemptsData) => {
    const totalQuizzes = quizzesData.length;
    const activeQuizzes = quizzesData.filter(q => q.isActive !== false).length;
    const totalAttempts = attemptsData.length;
    
    // Get unique students
    const uniqueStudentIds = [...new Set(attemptsData.map(a => a.studentId))];
    const uniqueStudents = uniqueStudentIds.length;

    // Calculate average score
    const totalScore = attemptsData.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0);
    const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;

    // Performance distribution
    const performanceDistribution = {
      excellent: attemptsData.filter(a => (a.percentage || 0) >= 90).length,
      good: attemptsData.filter(a => (a.percentage || 0) >= 70 && (a.percentage || 0) < 90).length,
      average: attemptsData.filter(a => (a.percentage || 0) >= 50 && (a.percentage || 0) < 70).length,
      needsImprovement: attemptsData.filter(a => (a.percentage || 0) < 50).length
    };

    setAnalytics({
      totalQuizzes,
      activeQuizzes,
      totalAttempts,
      uniqueStudents,
      averageScore,
      performanceDistribution
    });

    // Process students data
    const studentsMap = new Map();
    attemptsData.forEach(attempt => {
      if (!studentsMap.has(attempt.studentId)) {
        studentsMap.set(attempt.studentId, {
          id: attempt.studentId,
          name: attempt.studentName || attempt.studentEmail || 'Unknown',
          email: attempt.studentEmail || '',
          attempts: [],
          totalAttempts: 0,
          averageScore: 0,
          bestScore: 0,
          passedQuizzes: 0
        });
      }
      
      const student = studentsMap.get(attempt.studentId);
      student.attempts.push(attempt);
      student.totalAttempts++;
      
      const score = attempt.percentage || 0;
      if (score > student.bestScore) {
        student.bestScore = score;
      }
      
      if (score >= 50) {
        student.passedQuizzes++;
      }
    });

    // Calculate average scores for each student
    studentsMap.forEach(student => {
      const totalScore = student.attempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0);
      student.averageScore = student.attempts.length > 0 ? Math.round(totalScore / student.attempts.length) : 0;
    });

    setStudents(Array.from(studentsMap.values()));
  };

  const handleScoreDataCleanup = async () => {
    try {
      const result = await cleanupScoreData();
      if (result.success) {
        alert(`Success! ${result.message}`);
        // Refresh data after cleanup
        fetchData();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      alert('Failed to cleanup score data. Check console for details.');
    }
  };

  const handleToggleQuizStatus = async (quizId, currentStatus) => {
    try {
      const result = await toggleQuizStatus(quizId, !currentStatus);
      if (result.success) {
        // Update local state
        setQuizzes(quizzes.map(quiz => 
          quiz.id === quizId ? { ...quiz, isActive: !currentStatus } : quiz
        ));
      } else {
        alert('Failed to update quiz status: ' + result.error);
      }
    } catch (error) {
      console.error('Error toggling quiz status:', error);
      alert('Failed to update quiz status');
    }
  };

  const openStudentModal = (student) => {
    setSelectedStudent(student);
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setSelectedStudent(null);
    setIsStudentModalOpen(false);
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              QuizITI
            </h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Lecturer Portal
            </span>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-3 text-sm bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-900">{currentUser.name || 'Lecturer'}</p>
              <p className="text-xs text-gray-500">{currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalQuizzes || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.activeQuizzes || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.uniqueStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.averageScore || 0}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: '📊' },
                    { id: 'quizzes', name: 'Quiz Management', icon: '📝' },
                    { id: 'analytics', name: 'Performance Analytics', icon: '📈' },
                    { id: 'students', name: 'Student Performance', icon: '👥' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                      <Link
                        to="/create-quiz"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Create New Quiz
                      </Link>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Create Quiz Card */}
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-indigo-600 rounded-lg">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <h4 className="ml-3 text-lg font-semibold text-indigo-900">Create Quiz</h4>
                        </div>
                        <p className="text-indigo-700 mb-4">Start building a new quiz for your students</p>
                        <Link
                          to="/create-quiz"
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Get Started
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>

                      {/* View Results Card */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-green-600 rounded-lg">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="ml-3 text-lg font-semibold text-green-900">Analytics</h4>
                        </div>
                        <p className="text-green-700 mb-4">View detailed performance analytics</p>
                        <button
                          onClick={() => setActiveTab('analytics')}
                          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                        >
                          View Analytics
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>

                      {/* Student Performance Card */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center mb-4">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                          <h4 className="ml-3 text-lg font-semibold text-blue-900">Students</h4>
                        </div>
                        <p className="text-blue-700 mb-4">Monitor individual student progress</p>
                        <button
                          onClick={() => setActiveTab('students')}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Students
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Recent Quizzes Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">Recent Quizzes</h4>
                        <button
                          onClick={() => setActiveTab('quizzes')}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View All
                        </button>
                      </div>

                      {quizzes.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Get started by creating your first quiz.</p>
                          <div className="mt-6">
                            <Link
                              to="/create-quiz"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              Create Quiz
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto space-y-3">
                          {quizzes.slice(0, 5).map((quiz) => {
                            const quizAttempts = attempts.filter(attempt => attempt.quizId === quiz.id);
                            const questionsCount = quiz.questions?.length || 0;

                            return (
                              <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{quiz.title}</h5>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                    <span>{questionsCount} questions</span>
                                    <span>•</span>
                                    <span className={quiz.isActive !== false ? 'text-green-600' : 'text-gray-500'}>
                                      {quiz.isActive !== false ? '🟢 Active' : '⚫ Inactive'}
                                    </span>
                                    <span>•</span>
                                    <span>{quizAttempts.length} attempts</span>
                                  </div>
                                  {quiz.description && (
                                    <p className="text-xs text-gray-400 mt-1 truncate">{quiz.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Link
                                    to={`/view-results/${quiz.id}`}
                                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    View Results
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Conditional Data Maintenance Section - Only show if there are data issues */}
                    {attempts.some(attempt => (attempt.percentage || 0) > 100) && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-lg font-medium text-yellow-800">Data Issue Detected</h4>
                            <p className="text-sm text-yellow-700 mt-1 mb-4">
                              Some quiz scores appear to be calculated incorrectly (over 100%). Click below to fix this automatically.
                            </p>
                            <button
                              onClick={handleScoreDataCleanup}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Fix Score Data
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quiz Management Tab */}
                {activeTab === 'quizzes' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Quiz Management</h3>
                        <p className="text-sm text-gray-600">Manage all your quizzes in one place</p>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          to="/create-quiz"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Create New Quiz
                        </Link>
                      </div>
                    </div>

                    {/* Quiz Statistics */}
                    {quizzes.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-blue-600">Total Quizzes</p>
                              <p className="text-xl font-bold text-blue-900">{quizzes.length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-600 rounded-lg">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-green-600">Active Quizzes</p>
                              <p className="text-xl font-bold text-green-900">{quizzes.filter(q => q.isActive !== false).length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center">
                            <div className="p-2 bg-purple-600 rounded-lg">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-purple-600">Total Attempts</p>
                              <p className="text-xl font-bold text-purple-900">{attempts.length}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {quizzes.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No quizzes created yet</h3>
                        <p className="mt-2 text-sm text-gray-500">Get started by creating your first quiz for students.</p>
                        <div className="mt-6">
                          <Link
                            to="/create-quiz"
                            className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Quiz
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {quizzes.map((quiz) => {
                          const quizAttempts = attempts.filter(attempt => attempt.quizId === quiz.id);
                          const avgScore = quizAttempts.length > 0
                            ? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / quizAttempts.length)
                            : 0;

                          return (
                            <div key={quiz.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h4 className="text-xl font-semibold text-gray-900">{quiz.title}</h4>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      quiz.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {quiz.isActive !== false ? '🟢 Active' : '⚫ Inactive'}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                    <div>
                                      <span className="font-medium">Questions:</span> {quiz.questions?.length || 0}
                                    </div>
                                    <div>
                                      <span className="font-medium">Attempts:</span> {quizAttempts.length}
                                    </div>
                                    <div>
                                      <span className="font-medium">Avg Score:</span> {avgScore}%
                                    </div>
                                    <div>
                                      <span className="font-medium">Created:</span> {quiz.createdAt?.toDate ? quiz.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                    </div>
                                  </div>

                                  {quiz.description && (
                                    <p className="text-sm text-gray-500 mb-3">{quiz.description}</p>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => handleToggleQuizStatus(quiz.id, quiz.isActive !== false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                      quiz.isActive !== false
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    {quiz.isActive !== false ? '⏸️ Deactivate' : '▶️ Activate'}
                                  </button>

                                  <Link
                                    to={`/view-results/${quiz.id}`}
                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                                  >
                                    📊 View Results
                                  </Link>

                                  <Link
                                    to="/create-quiz"
                                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                                    title="Create a new quiz (Edit functionality coming soon)"
                                  >
                                    ✏️ Edit
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
                      <p className="text-sm text-gray-600">Comprehensive insights into student performance and quiz effectiveness</p>
                    </div>

                    {attempts.length === 0 ? (
                      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No analytics data yet</h3>
                        <p className="mt-2 text-sm text-gray-500">Analytics will appear here once students start taking your quizzes.</p>
                      </div>
                    ) : (
                      <>
                        {/* Performance Distribution */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">📊 Class Performance Distribution</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-3xl font-bold text-green-600 mb-2">{analytics.performanceDistribution.excellent}</div>
                              <div className="text-sm font-medium text-green-800">🏆 Excellent</div>
                              <div className="text-xs text-green-600">(90% - 100%)</div>
                              <div className="mt-2 text-xs text-gray-500">
                                {attempts.length > 0 ? Math.round((analytics.performanceDistribution.excellent / attempts.length) * 100) : 0}% of attempts
                              </div>
                            </div>

                            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.performanceDistribution.good}</div>
                              <div className="text-sm font-medium text-blue-800">👍 Good</div>
                              <div className="text-xs text-blue-600">(70% - 89%)</div>
                              <div className="mt-2 text-xs text-gray-500">
                                {attempts.length > 0 ? Math.round((analytics.performanceDistribution.good / attempts.length) * 100) : 0}% of attempts
                              </div>
                            </div>

                            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="text-3xl font-bold text-yellow-600 mb-2">{analytics.performanceDistribution.average}</div>
                              <div className="text-sm font-medium text-yellow-800">📈 Average</div>
                              <div className="text-xs text-yellow-600">(50% - 69%)</div>
                              <div className="mt-2 text-xs text-gray-500">
                                {attempts.length > 0 ? Math.round((analytics.performanceDistribution.average / attempts.length) * 100) : 0}% of attempts
                              </div>
                            </div>

                            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="text-3xl font-bold text-red-600 mb-2">{analytics.performanceDistribution.needsImprovement}</div>
                              <div className="text-sm font-medium text-red-800">📚 Needs Help</div>
                              <div className="text-xs text-red-600">(&lt; 50%)</div>
                              <div className="mt-2 text-xs text-gray-500">
                                {attempts.length > 0 ? Math.round((analytics.performanceDistribution.needsImprovement / attempts.length) * 100) : 0}% of attempts
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quiz Performance Breakdown */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">📝 Quiz Performance Breakdown</h4>
                          <div className="max-h-80 overflow-y-auto space-y-4">
                            {quizzes.map((quiz) => {
                              const quizAttempts = attempts.filter(attempt => attempt.quizId === quiz.id);
                              const avgScore = quizAttempts.length > 0
                                ? Math.round(quizAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / quizAttempts.length)
                                : 0;
                              const passRate = quizAttempts.length > 0
                                ? Math.round((quizAttempts.filter(attempt => (attempt.percentage || 0) >= 50).length / quizAttempts.length) * 100)
                                : 0;

                              return (
                                <div key={quiz.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                      <h5 className="font-medium text-gray-900">{quiz.title}</h5>
                                      <p className="text-sm text-gray-500">{quizAttempts.length} attempts</p>
                                    </div>
                                    <div className="flex items-center space-x-6 text-sm">
                                      <div className="text-center">
                                        <div className="font-semibold text-gray-900">{avgScore}%</div>
                                        <div className="text-gray-500">Avg Score</div>
                                      </div>
                                      <div className="text-center">
                                        <div className="font-semibold text-gray-900">{passRate}%</div>
                                        <div className="text-gray-500">Pass Rate</div>
                                      </div>
                                      <Link
                                        to={`/view-results/${quiz.id}`}
                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1 rounded text-sm font-medium transition-colors"
                                      >
                                        View Details
                                      </Link>
                                    </div>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        avgScore >= 90 ? 'bg-green-500' :
                                        avgScore >= 70 ? 'bg-blue-500' :
                                        avgScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${Math.min(avgScore, 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Progress Chart */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">📈 Visual Progress Tracking</h4>

                          {attempts.length === 0 ? (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Data Yet</h3>
                              <p className="text-gray-500">Progress charts will appear once students start taking your quizzes.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Overall Class Performance */}
                              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                <div className="flex justify-between items-center mb-3">
                                  <div>
                                    <span className="text-sm font-medium text-gray-700">Overall Class Performance</span>
                                    <p className="text-xs text-gray-500 mt-1">Average score across all quiz attempts</p>
                                  </div>
                                  <span className="text-2xl font-bold text-indigo-600">{analytics.averageScore}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                                  <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(analytics.averageScore || 0, 100)}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>0%</span>
                                  <span>50%</span>
                                  <span>100%</span>
                                </div>
                              </div>

                              {/* Performance Distribution */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-green-600 font-medium">🏆 Excellent</div>
                                    <div className="text-lg font-bold text-green-700">{analytics.performanceDistribution.excellent}</div>
                                  </div>
                                  <div className="text-xs text-green-600 mb-2">90% - 100%</div>
                                  <div className="w-full bg-green-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all duration-700"
                                      style={{ width: `${attempts.length > 0 ? (analytics.performanceDistribution.excellent / attempts.length) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {attempts.length > 0 ? Math.round((analytics.performanceDistribution.excellent / attempts.length) * 100) : 0}% of attempts
                                  </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-blue-600 font-medium">👍 Good</div>
                                    <div className="text-lg font-bold text-blue-700">{analytics.performanceDistribution.good}</div>
                                  </div>
                                  <div className="text-xs text-blue-600 mb-2">70% - 89%</div>
                                  <div className="w-full bg-blue-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                                      style={{ width: `${attempts.length > 0 ? (analytics.performanceDistribution.good / attempts.length) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {attempts.length > 0 ? Math.round((analytics.performanceDistribution.good / attempts.length) * 100) : 0}% of attempts
                                  </div>
                                </div>

                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-yellow-600 font-medium">📈 Average</div>
                                    <div className="text-lg font-bold text-yellow-700">{analytics.performanceDistribution.average}</div>
                                  </div>
                                  <div className="text-xs text-yellow-600 mb-2">50% - 69%</div>
                                  <div className="w-full bg-yellow-200 rounded-full h-2">
                                    <div
                                      className="bg-yellow-500 h-2 rounded-full transition-all duration-700"
                                      style={{ width: `${attempts.length > 0 ? (analytics.performanceDistribution.average / attempts.length) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {attempts.length > 0 ? Math.round((analytics.performanceDistribution.average / attempts.length) * 100) : 0}% of attempts
                                  </div>
                                </div>

                                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs text-red-600 font-medium">📚 Need Support</div>
                                    <div className="text-lg font-bold text-red-700">{analytics.performanceDistribution.needsImprovement}</div>
                                  </div>
                                  <div className="text-xs text-red-600 mb-2">Below 50%</div>
                                  <div className="w-full bg-red-200 rounded-full h-2">
                                    <div
                                      className="bg-red-500 h-2 rounded-full transition-all duration-700"
                                      style={{ width: `${attempts.length > 0 ? (analytics.performanceDistribution.needsImprovement / attempts.length) * 100 : 0}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {attempts.length > 0 ? Math.round((analytics.performanceDistribution.needsImprovement / attempts.length) * 100) : 0}% of attempts
                                  </div>
                                </div>
                              </div>

                              {/* Progress Trends */}
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-900 mb-3">📊 Class Progress Summary</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{attempts.length}</div>
                                    <div className="text-gray-600">Total Attempts</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                      {attempts.length > 0 ? Math.round((attempts.filter(a => (a.percentage || 0) >= 70).length / attempts.length) * 100) : 0}%
                                    </div>
                                    <div className="text-gray-600">Pass Rate</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{analytics.averageScore}%</div>
                                    <div className="text-gray-600">Class Average</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg p-6 border border-gray-200">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">🕒 Recent Quiz Attempts</h4>
                          <div className="max-h-64 overflow-y-auto space-y-3">
                            {attempts.slice(0, 10).map((attempt, index) => {
                              const quiz = quizzes.find(q => q.id === attempt.quizId);
                              const scoreColor = attempt.percentage >= 90 ? 'text-green-600' :
                                               attempt.percentage >= 70 ? 'text-blue-600' :
                                               attempt.percentage >= 50 ? 'text-yellow-600' : 'text-red-600';
                              const scoreBg = attempt.percentage >= 90 ? 'bg-green-100' :
                                            attempt.percentage >= 70 ? 'bg-blue-100' :
                                            attempt.percentage >= 50 ? 'bg-yellow-100' : 'bg-red-100';

                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{attempt.studentName || attempt.studentEmail}</div>
                                    <div className="text-sm text-gray-500">{quiz?.title || 'Unknown Quiz'}</div>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${scoreColor} ${scoreBg}`}>
                                      {Math.round(attempt.percentage || 0)}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {attempt.completedAt?.toDate ? attempt.completedAt.toDate().toLocaleDateString() : 'Recently'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Student Performance</h3>

                    {students.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No student data</h3>
                        <p className="mt-1 text-sm text-gray-500">Student performance data will appear here once students start taking quizzes.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((student) => (
                          <div key={student.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => openStudentModal(student)}>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900 truncate">{student.name}</h4>
                              <span className="text-xs text-gray-500">{student.totalAttempts} attempts</span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Average Score:</span>
                                <span className={`font-semibold ${getPerformanceColor(student.averageScore)}`}>
                                  {student.averageScore}%
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Best Score:</span>
                                <span className={`font-semibold ${getPerformanceColor(student.bestScore)}`}>
                                  {student.bestScore}%
                                </span>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Passed Quizzes:</span>
                                <span className="font-semibold text-gray-900">
                                  {student.passedQuizzes}/{student.totalAttempts}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Student Detail Modal */}
        <StudentDetailModal
          student={selectedStudent}
          attempts={attempts}
          quizzes={quizzes}
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
        />
      </div>
    </div>
  );
};

export default LecturerDashboard;
