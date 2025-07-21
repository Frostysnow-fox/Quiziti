import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getQuizWithQuestions, calculateScore } from '../services/quizService';
import { createQuizAttempt, hasStudentAttemptedQuiz } from '../services/database';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // First check if student has already attempted this quiz
        const attemptCheck = await hasStudentAttemptedQuiz(currentUser.uid, quizId);
        if (attemptCheck.success && attemptCheck.hasAttempted) {
          setError('You have already attempted this quiz. Each quiz can only be taken once.');
          setLoading(false);
          return;
        }

        const result = await getQuizWithQuestions(quizId);
        if (result.success) {
          setQuiz(result.data);
          setTimeLeft(result.data.timeLimitMinutes * 60); // Convert to seconds
          setAnswers(new Array(result.data.questions.length).fill({ selectedOptionIndex: null }));
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, currentUser.uid]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      // Time's up, auto-submit
      handleSubmit();
    }
  }, [timeLeft, isSubmitting, quiz]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = { selectedOptionIndex: optionIndex };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const endTime = Date.now();
      const timeTakenMinutes = Math.round((endTime - startTime) / (1000 * 60));
      
      // Calculate score
      const scoreData = calculateScore(answers, quiz.questions);
      
      // Create quiz attempt
      const attemptData = {
        quizId: quiz.id,
        studentId: currentUser.uid,
        studentName: currentUser.name || currentUser.email || 'Unknown Student',
        studentEmail: currentUser.email,
        score: scoreData.score, // Number of correct answers
        totalQuestions: quiz.questions.length,
        percentage: scoreData.percentage, // Percentage score
        timeTakenMinutes,
        timeSpent: Math.round(timeTakenMinutes * 60), // in seconds
        answers: scoreData.answers,
        quizTitle: quiz.title,
        correctAnswers: scoreData.correctAnswers
      };
      
      const result = await createQuizAttempt(attemptData);

      if (result.success) {
        // Navigate to results page
        navigate(`/quiz-results/${result.id}`, {
          state: {
            score: scoreData.percentage, // Pass percentage for display
            correctAnswers: scoreData.correctAnswers,
            totalQuestions: scoreData.totalQuestions,
            timeTaken: timeTakenMinutes,
            quizTitle: quiz.title
          }
        });
      } else {
        setError('Failed to submit quiz');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-text">Loading quiz...</p>
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
            onClick={() => navigate('/student-dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Quiz not found</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
              <div className="flex items-center mt-2">
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-indigo-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600 font-medium">Time Remaining</p>
              {timeLeft < 300 && (
                <p className="text-xs text-red-500 mt-1">⚠️ Hurry up!</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentQuestion.questionText}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    answers[currentQuestionIndex]?.selectedOptionIndex === index
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    checked={answers[currentQuestionIndex]?.selectedOptionIndex === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    answers[currentQuestionIndex]?.selectedOptionIndex === index
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQuestionIndex]?.selectedOptionIndex === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3 ${
                      answers[currentQuestionIndex]?.selectedOptionIndex === index
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-900 text-lg">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
            >
              ← Previous
            </button>

            <div className="text-center">
              <div className="text-sm font-medium text-gray-700">
                Progress: {answers.filter(a => a.selectedOptionIndex !== null).length} of {quiz.questions.length} answered
              </div>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(answers.filter(a => a.selectedOptionIndex !== null).length / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Quiz →'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
