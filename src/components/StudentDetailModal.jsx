import React from 'react';

const StudentDetailModal = ({ student, attempts, quizzes, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  // Calculate student statistics
  const studentAttempts = attempts.filter(attempt => attempt.studentId === student.id);
  const totalAttempts = studentAttempts.length;
  const averageScore = totalAttempts > 0 
    ? Math.round(studentAttempts.reduce((sum, attempt) => sum + (attempt.percentage || 0), 0) / totalAttempts)
    : 0;
  
  const bestScore = totalAttempts > 0 
    ? Math.max(...studentAttempts.map(attempt => attempt.percentage || 0))
    : 0;
  
  const recentAttempts = studentAttempts
    .sort((a, b) => {
      const dateA = a.dateTaken?.toDate ? a.dateTaken.toDate() : new Date(a.dateTaken);
      const dateB = b.dateTaken?.toDate ? b.dateTaken.toDate() : new Date(b.dateTaken);
      return dateB - dateA;
    })
    .slice(0, 5);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-blue-100 text-blue-800';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
              <span className="text-lg font-bold text-indigo-600">
                {(student.name || student.email || 'Unknown').charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{student.name || 'Unknown Student'}</h2>
              <p className="text-gray-600">{student.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{totalAttempts}</div>
              <div className="text-sm text-blue-700">Total Attempts</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{averageScore}%</div>
              <div className="text-sm text-green-700">Average Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{bestScore}%</div>
              <div className="text-sm text-purple-700">Best Score</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">
                {studentAttempts.filter(a => (a.percentage || 0) >= 70).length}
              </div>
              <div className="text-sm text-orange-700">Passed Quizzes</div>
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Progress</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500">Progress Chart</p>
                  <p className="text-sm text-gray-400">Visual progress tracking coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Quiz Attempts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Quiz Attempts</h3>
            {recentAttempts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No quiz attempts found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt, index) => (
                  <div key={attempt.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{attempt.quizTitle || 'Unknown Quiz'}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Attempted on {formatDate(attempt.dateTaken)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Time taken: {attempt.timeTakenMinutes || Math.round((attempt.timeSpent || 0) / 60)} minutes
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPerformanceBadge(attempt.percentage || 0)}`}>
                          {attempt.percentage || 0}%
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {attempt.score || 0}/{attempt.totalQuestions || 0} correct
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
