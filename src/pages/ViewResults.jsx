import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, getQuizAttempts, getUser } from '../services/database';

const ViewResults = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch quiz details
        const quizResult = await getQuiz(quizId);
        if (!quizResult.success) {
          setError('Quiz not found');
          return;
        }
        setQuiz(quizResult.data);
        
        // Fetch quiz attempts
        const attemptsResult = await getQuizAttempts({ quizId });
        if (attemptsResult.success) {
          // Fetch student names for each attempt and fix data issues
          const attemptsWithNames = await Promise.all(
            attemptsResult.data.map(async (attempt) => {
              const userResult = await getUser(attempt.studentId);

              // Fix data issues - ensure we have proper values
              let fixedAttempt = {
                ...attempt,
                studentName: userResult.success ? userResult.data.name || userResult.data.email : 'Unknown Student'
              };

              // Ensure we have totalQuestions from the quiz if missing
              if (!fixedAttempt.totalQuestions && quizResult.data.questions) {
                fixedAttempt.totalQuestions = quizResult.data.questions.length;
              }

              // Recalculate percentage if it's 0 but we have score and totalQuestions
              if (fixedAttempt.percentage === 0 && fixedAttempt.score > 0 && fixedAttempt.totalQuestions > 0) {
                fixedAttempt.percentage = Math.round((fixedAttempt.score / fixedAttempt.totalQuestions) * 100);
              }

              // If percentage is still 0, check if score is actually the percentage (legacy data)
              if (fixedAttempt.percentage === 0 && fixedAttempt.score > 0 && fixedAttempt.score <= 100) {
                fixedAttempt.percentage = fixedAttempt.score;
                fixedAttempt.score = Math.round((fixedAttempt.percentage / 100) * fixedAttempt.totalQuestions);
              }

              // Ensure minimum values
              fixedAttempt.score = fixedAttempt.score || 0;
              fixedAttempt.percentage = fixedAttempt.percentage || 0;
              fixedAttempt.totalQuestions = fixedAttempt.totalQuestions || 0;
              fixedAttempt.timeTakenMinutes = fixedAttempt.timeTakenMinutes || 0;

              console.log('Fixed attempt data:', fixedAttempt);
              return fixedAttempt;
            })
          );
          setAttempts(attemptsWithNames);
        } else {
          setAttempts([]);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const calculateStats = () => {
    if (attempts.length === 0) return null;

    const percentages = attempts.map(a => a.percentage || 0);
    const averageScore = percentages.reduce((sum, percentage) => sum + percentage, 0) / percentages.length;
    const highestScore = Math.max(...percentages);
    const lowestScore = Math.min(...percentages);
    const passCount = percentages.filter(percentage => percentage >= 70).length;
    const passRate = (passCount / percentages.length) * 100;

    return {
      totalAttempts: attempts.length,
      averageScore: Math.round(averageScore),
      highestScore,
      lowestScore,
      passRate: Math.round(passRate)
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-text">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/lecturer-dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/lecturer-dashboard')}
            className="text-primary hover:text-indigo-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h1 className="text-2xl font-bold text-text mb-2">{quiz?.title}</h1>
          <p className="text-gray-600 mb-4">Quiz Results Overview</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{quiz?.questionIds?.length || 0}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{quiz?.timeLimitMinutes}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{attempts.length}</div>
              <div className="text-sm text-gray-600">Attempts</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{quiz?.topic}</div>
              <div className="text-sm text-gray-600">Topic</div>
            </div>
          </div>
        </div>

        {stats && (
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <h2 className="text-xl font-semibold text-text mb-6">Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{stats.averageScore}%</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.highestScore}%</div>
                <div className="text-sm text-gray-600">Highest Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{stats.lowestScore}%</div>
                <div className="text-sm text-gray-600">Lowest Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">{stats.passRate}%</div>
                <div className="text-sm text-gray-600">Pass Rate (≥70%)</div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-text mb-6">Individual Results</h2>
          
          {attempts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attempts yet</h3>
              <p className="mt-1 text-sm text-gray-500">Students haven't taken this quiz yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time & Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                              {attempt.studentName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Student ID: {attempt.studentId.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage || 0)} mr-3`}>
                            {attempt.percentage || 0}%
                          </div>
                          <div className="text-sm text-gray-500">
                            <div>{attempt.score || 0} correct</div>
                            <div>out of {attempt.totalQuestions || 0}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {attempt.timeTakenMinutes} min
                          </div>
                          <div className="flex items-center text-gray-500">
                            <svg className="h-4 w-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm6 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {formatDate(attempt.dateTaken)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start space-y-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getScoreBadge(attempt.percentage || 0)}`}>
                            {(attempt.percentage || 0) >= 70 ? '✓ Pass' : '✗ Fail'}
                          </span>
                          <div className={`text-xs ${getScoreColor(attempt.percentage || 0)}`}>
                            {(attempt.percentage || 0) >= 90 ? 'Excellent' :
                             (attempt.percentage || 0) >= 80 ? 'Very Good' :
                             (attempt.percentage || 0) >= 70 ? 'Good' :
                             (attempt.percentage || 0) >= 50 ? 'Average' : 'Poor'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResults;
