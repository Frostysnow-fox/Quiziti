import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    score,
    correctAnswers,
    totalQuestions,
    timeTaken,
    quizTitle
  } = location.state || {};

  if (!location.state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text mb-4">No quiz results found</p>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Outstanding! 🎉';
    if (score >= 80) return 'Excellent work! 👏';
    if (score >= 70) return 'Good job! 👍';
    if (score >= 50) return 'Keep practicing! 📚';
    return 'Need more study time! 💪';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg border p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Quiz Complete!</h1>
            <p className="text-gray-600">{quizTitle}</p>
          </div>

          {/* Score Display */}
          <div className="mb-8">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-2xl font-medium text-text mb-2">
              {getScoreMessage(score)} ({score}%)
            </div>
            <p className="text-gray-600">
              You got {correctAnswers} out of {totalQuestions} questions correct
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-primary">{timeTaken}</div>
              <div className="text-sm text-gray-600">Minutes Taken</div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="mb-8">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              score >= 70 
                ? 'bg-green-100 text-green-800' 
                : score >= 50 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {score >= 90 ? '🏆 Outstanding Performance' :
               score >= 80 ? '🥇 Excellent Performance' :
               score >= 70 ? '🥈 Good Performance' :
               score >= 50 ? '🥉 Average Performance' :
               '📚 Needs Improvement'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              Back to Dashboard
            </button>
            
            {score < 70 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  💡 <strong>Tip:</strong> Review the topics covered in this quiz and try again to improve your score!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
