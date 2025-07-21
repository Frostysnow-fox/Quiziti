import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getQuizzes, getQuizAttempts, hasStudentAttemptedQuiz } from '../services/database';
import DashboardLayout from '../components/DashboardLayout';

const StudentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUser || !currentUser.uid) {
          setError('User not authenticated');
          return;
        }

        // Fetch available quizzes (only active ones)
        try {
          console.log('Fetching quizzes for student...');
          const quizzesResult = await getQuizzes();
          console.log('Raw quiz result:', quizzesResult);

          if (quizzesResult.success) {
            console.log('All quizzes from database:', quizzesResult.data);
            console.log('Total quiz count:', quizzesResult.data.length);

            // Check each quiz's isActive status
            quizzesResult.data.forEach(quiz => {
              console.log(`Quiz "${quiz.title}": isActive = ${quiz.isActive}`);
            });

            const quizList = quizzesResult.data.filter(quiz => quiz.isActive !== false);
            console.log('Filtered active quizzes:', quizList);
            console.log('Active quiz count:', quizList.length);
            setQuizzes(quizList);

            // Check which quizzes have been attempted
            const attemptedSet = new Set();
            for (const quiz of quizList) {
              try {
                const attemptCheck = await hasStudentAttemptedQuiz(currentUser.uid, quiz.id);
                if (attemptCheck.success && attemptCheck.hasAttempted) {
                  attemptedSet.add(quiz.id);
                }
              } catch (attemptError) {
                console.error('Error checking attempt for quiz:', quiz.id, attemptError);
              }
            }
            setAttemptedQuizzes(attemptedSet);
          } else {
            console.error('Failed to load quizzes:', quizzesResult.error);
            setError('Failed to load quizzes: ' + quizzesResult.error);
          }
        } catch (quizError) {
          console.error('Error fetching quizzes:', quizError);
          setError('Error fetching quizzes: ' + quizError.message);
        }

        // Fetch past results
        try {
          const attemptsResult = await getQuizAttempts({ studentId: currentUser.uid });

          if (attemptsResult.success) {
            if (attemptsResult.data.length > 0) {
              // Enrich attempts with quiz titles
              const enrichedResults = [];
              for (const attempt of attemptsResult.data) {
                const enrichedAttempt = {
                  ...attempt,
                  quizTitle: attempt.quizTitle || 'Unknown Quiz',
                  quizChapter: attempt.quizChapter || 'Unknown Chapter'
                };
                enrichedResults.push(enrichedAttempt);
              }

              setPastResults(enrichedResults);
            } else {
              setPastResults([]);
            }
          } else {
            setPastResults([]);
          }
        } catch (attemptError) {
          console.error('Error fetching attempts:', attemptError);
          setPastResults([]);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
        setError('Failed to load dashboard data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && currentUser.uid) {
      fetchData();
    } else {
      setLoading(false);
      setError('Please log in to view dashboard');
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await logout();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const getQuizTitle = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    return quiz ? quiz.title : 'Unknown Quiz';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      userRole="student"
    >
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          {/* Student Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {(currentUser.name || currentUser.email || 'S').charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentUser.name || 'Student'}</h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{pastResults.length}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pastResults.length > 0 ? Math.round(pastResults.reduce((sum, result) => sum + (result.percentage || 0), 0) / pastResults.length) : 0}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pastResults.length > 0 ? Math.max(...pastResults.map(result => result.percentage || 0)) : 0}%
                </div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pastResults.filter(result => (result.percentage || 0) >= 70).length}
                </div>
                <div className="text-sm text-gray-600">Passed Quizzes</div>
              </div>
            </div>

            {/* Visual Progress Chart */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance Progress</h3>

              {pastResults.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-md font-medium text-gray-700 mb-2">No Progress Data Yet</h4>
                  <p className="text-sm text-gray-500">Take your first quiz to see your progress chart!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Overall Progress Bar */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Performance</span>
                      <span className="text-lg font-bold text-indigo-600">
                        {Math.round(pastResults.reduce((sum, result) => sum + (result.percentage || 0), 0) / pastResults.length)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round(pastResults.reduce((sum, result) => sum + (result.percentage || 0), 0) / pastResults.length)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Performance Categories */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 font-medium">🏆 Excellent (90%+)</div>
                      <div className="text-lg font-bold text-green-700">
                        {pastResults.filter(r => (r.percentage || 0) >= 90).length}
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${pastResults.length > 0 ? (pastResults.filter(r => (r.percentage || 0) >= 90).length / pastResults.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-xs text-red-600 font-medium">📚 Need Improvement</div>
                      <div className="text-lg font-bold text-red-700">
                        {pastResults.filter(r => (r.percentage || 0) < 50).length}
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-red-500 h-1 rounded-full"
                          style={{ width: `${pastResults.length > 0 ? (pastResults.filter(r => (r.percentage || 0) < 50).length / pastResults.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Take Quiz Tab */}
      {activeTab === 'take-quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Quizzes */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Available Quizzes</h2>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Debug: Loaded {quizzes.length} quizzes | Loading: {loading ? 'Yes' : 'No'}
                {error && <span className="text-red-600"> | Error: {error}</span>}
              </p>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 mt-2">No quizzes available at the moment.</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2">
                <div className="space-y-4">
                  {quizzes.map((quiz) => {
                  const isAttempted = attemptedQuizzes.has(quiz.id);
                  return (
                    <div key={quiz.id} className={`border rounded-lg p-5 transition-all duration-200 ${
                      isAttempted
                        ? 'border-gray-300 bg-gray-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-semibold text-lg ${isAttempted ? 'text-gray-600' : 'text-gray-900'}`}>
                              {quiz.title}
                            </h3>
                            {isAttempted && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="font-medium text-gray-700">Chapter:</span>
                              <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{quiz.chapter}</span>
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {quiz.timeLimitMinutes} minutes
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {quiz.questions ? quiz.questions.length : quiz.questionIds ? quiz.questionIds.length : 0} questions
                            </p>
                          </div>
                        </div>
                        {isAttempted ? (
                          <div className="text-center">
                            <div className="bg-gray-500 text-white px-6 py-3 rounded-lg text-sm font-semibold cursor-not-allowed border border-gray-600">
                              Already Attempted
                            </div>
                            <p className="text-xs text-gray-700 mt-1 font-medium">One attempt only</p>
                          </div>
                        ) : (
                          <Link
                            to={`/take-quiz/${quiz.id}`}
                            onClick={() => console.log('Starting quiz:', quiz.id, quiz.title)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm hover:shadow-md border border-indigo-700"
                          >
                            Start Quiz
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Past Results */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Past Results</h2>
            </div>
            {pastResults.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500 mt-2">No quiz attempts yet.</p>
                <p className="text-gray-400 text-sm mt-1">Take your first quiz to see results here!</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto pr-2">
                <div className="space-y-4">
                  {pastResults.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{result.quizTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">Chapter: {result.quizChapter}</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Score:</span>
                            <span className={`text-2xl font-bold ${(result.percentage || 0) >= 70 ? 'text-green-600' : (result.percentage || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {result.percentage || 0}%
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {result.timeTakenMinutes} minutes
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {formatDate(result.dateTaken)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          (result.percentage || 0) >= 70
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : (result.percentage || 0) >= 50
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {(result.percentage || 0) >= 70 ? '🎉 Excellent' : (result.percentage || 0) >= 50 ? '👍 Good' : '📚 Needs Work'}
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Results Tab */}
      {activeTab === 'results' && (
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">My Quiz Results</h2>
            </div>

            {pastResults.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Yet</h3>
                <p className="mt-2 text-gray-500">You haven't completed any quizzes yet. Take your first quiz to see your results here!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{result.quizTitle}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Score:</span>
                            <span className="ml-2 font-medium">{result.score}/{result.totalQuestions}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Percentage:</span>
                            <span className="ml-2 font-medium">{result.percentage || 0}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <span className="ml-2 font-medium">{result.timeTaken || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <span className="ml-2 font-medium">
                              {result.completedAt?.toDate ? result.completedAt.toDate().toLocaleDateString() : 'Recently'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          (result.percentage || 0) >= 70
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : (result.percentage || 0) >= 50
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {(result.percentage || 0) >= 70 ? '🎉 Excellent' : (result.percentage || 0) >= 50 ? '👍 Good' : '📚 Needs Work'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;
