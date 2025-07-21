import React, { useState, useEffect } from 'react';
import { getQuestionsByLecturer, deleteQuestion } from '../services/database';
import { useAuth } from '../hooks/useAuth';

const QuestionBank = () => {
  const { currentUser } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterChapter, setFilterChapter] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [currentUser]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      if (currentUser?.uid) {
        const result = await getQuestionsByLecturer(currentUser.uid);
        if (result.success) {
          setQuestions(result.data);
        }
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        const result = await deleteQuestion(questionId);
        if (result.success) {
          setQuestions(questions.filter(q => q.id !== questionId));
        } else {
          alert('Failed to delete question: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Failed to delete question');
      }
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.chapter?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || question.subject === filterSubject;
    const matchesChapter = !filterChapter || question.chapter === filterChapter;
    
    return matchesSearch && matchesSubject && matchesChapter;
  });

  const subjects = [...new Set(questions.map(q => q.subject).filter(Boolean))];
  const chapters = [...new Set(questions.map(q => q.chapter).filter(Boolean))];

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'badge-success',
      medium: 'badge-warning',
      hard: 'badge-error'
    };
    return badges[difficulty?.toLowerCase()] || 'badge-info';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading questions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
          <p className="text-gray-600">Manage and reuse your quiz questions</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredQuestions.length} of {questions.length} questions
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Questions
            </label>
            <input
              type="text"
              placeholder="Search by question, subject, or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Subject
            </label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Chapter
            </label>
            <select
              value={filterChapter}
              onChange={(e) => setFilterChapter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Chapters</option>
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>{chapter}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {questions.length === 0 ? 'No questions yet' : 'No questions match your filters'}
          </h3>
          <p className="text-gray-500">
            {questions.length === 0 
              ? 'Create your first quiz to start building your question bank'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question, index) => (
            <div key={question.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      Question #{index + 1}
                    </span>
                    {question.difficulty && (
                      <span className={`${getDifficultyBadge(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    )}
                    {question.subject && (
                      <span className="badge-info">
                        {question.subject}
                      </span>
                    )}
                    {question.chapter && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {question.chapter}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {question.question}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded border text-sm ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>{' '}
                        {option}
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ml-4 flex space-x-2">
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Question"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-1">Explanation:</div>
                  <div className="text-sm text-blue-700">{question.explanation}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
