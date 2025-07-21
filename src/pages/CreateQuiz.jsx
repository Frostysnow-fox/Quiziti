import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getQuestions, createQuiz, createQuestion } from '../services/database';
import { generateQuiz, validateQuizData } from '../services/quizService';
import { populateSampleQuestions } from '../services/sampleDataService';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Basic Electronics',
    chapter: '',
    numberOfQuestions: 10,
    timeLimitMinutes: 30
  });

  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedQuestionObjects, setSelectedQuestionObjects] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [populatingQuestions, setPopulatingQuestions] = useState(false);

  const subjects = ['Basic Electronics', 'Digital Electronics', 'Analog Electronics'];
  const chapters = {
    'Basic Electronics': ['Semiconductors', 'Diodes', 'Transistors', 'Amplifiers'],
    'Digital Electronics': ['Logic Gates', 'Boolean Algebra', 'Flip Flops', 'Counters'],
    'Analog Electronics': ['Op-Amps', 'Oscillators', 'Filters', 'Power Amplifiers']
  };

  useEffect(() => {
    if (formData.subject && formData.chapter) {
      fetchAvailableQuestions();
    }
  }, [formData.subject, formData.chapter]);

  const fetchAvailableQuestions = async () => {
    try {
      const result = await getQuestions({
        subject: formData.subject,
        chapter: formData.chapter
      });

      if (result.success) {
        setAvailableQuestions(result.data);
      } else {
        setAvailableQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setAvailableQuestions([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset chapter when subject changes
    if (name === 'subject') {
      setFormData(prev => ({
        ...prev,
        chapter: ''
      }));
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      setError(null);
      console.log('Generating questions with criteria:', {
        subject: formData.subject,
        chapter: formData.chapter,
        numberOfQuestions: parseInt(formData.numberOfQuestions)
      });

      // Get questions directly from database
      const questionsResult = await getQuestions({
        subject: formData.subject,
        chapter: formData.chapter
      });

      if (!questionsResult.success) {
        setError(questionsResult.error);
        return;
      }

      const availableQs = questionsResult.data;
      console.log(`Found ${availableQs.length} questions for ${formData.subject} > ${formData.chapter}`);

      if (availableQs.length < parseInt(formData.numberOfQuestions)) {
        setError(`Not enough questions available. Found ${availableQs.length}, need ${formData.numberOfQuestions}. Please add more questions or reduce the number.`);
        return;
      }

      // Randomly select questions
      const shuffled = availableQs.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, parseInt(formData.numberOfQuestions));

      setSelectedQuestions(selected.map(q => q.id));
      setSelectedQuestionObjects(selected);
      console.log('Selected questions:', selected);

    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate questions: ' + error.message);
    }
  };

  const handlePopulateSampleQuestions = async () => {
    try {
      setPopulatingQuestions(true);
      setError(null);

      const result = await populateSampleQuestions();

      if (result.success) {
        // Refresh available questions after populating
        if (formData.subject && formData.chapter) {
          await fetchAvailableQuestions();
        }
        alert('🎉 480+ Sample questions added successfully! (10 questions per chapter)\nYou can now build quizzes for any chapter.');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error populating sample questions:', error);
      setError('Failed to populate sample questions: ' + error.message);
    } finally {
      setPopulatingQuestions(false);
    }
  };

  const handlePreviewQuiz = () => {
    setShowPreview(true);
  };

  const handleEditQuestion = (question, index) => {
    setEditingQuestion({ ...question, index });
  };

  const handleSaveEditedQuestion = (editedQuestion) => {
    const updatedQuestions = [...selectedQuestionObjects];
    updatedQuestions[editedQuestion.index] = editedQuestion;
    setSelectedQuestionObjects(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, save any edited questions as new questions in the database
      const finalQuestionIds = [];

      for (let i = 0; i < selectedQuestionObjects.length; i++) {
        const question = selectedQuestionObjects[i];
        const originalId = selectedQuestions[i];

        // Check if the question was edited by comparing with original
        const originalQuestion = availableQuestions.find(q => q.id === originalId);
        const wasEdited = !originalQuestion ||
          question.questionText !== originalQuestion.questionText ||
          JSON.stringify(question.options) !== JSON.stringify(originalQuestion.options) ||
          question.correctOptionIndex !== originalQuestion.correctOptionIndex ||
          question.explanation !== originalQuestion.explanation;

        if (wasEdited) {
          // Create a new question for edited content
          const newQuestionData = {
            questionText: question.questionText,
            options: question.options,
            correctOptionIndex: question.correctOptionIndex,
            explanation: question.explanation || '',
            subject: question.subject || formData.subject,
            chapter: question.chapter || formData.chapter,
            authorId: currentUser.uid
          };

          const createResult = await createQuestion(newQuestionData);
          if (createResult.success) {
            finalQuestionIds.push(createResult.id);
          } else {
            throw new Error(`Failed to save edited question: ${createResult.error}`);
          }
        } else {
          // Use original question ID
          finalQuestionIds.push(originalId);
        }
      }

      const quizData = {
        title: formData.title,
        subject: formData.subject,
        chapter: formData.chapter,
        timeLimitMinutes: parseInt(formData.timeLimitMinutes),
        questionIds: finalQuestionIds,
        creatorId: currentUser.uid
      };

      const validation = validateQuizData(quizData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        setLoading(false);
        return;
      }

      const result = await createQuiz(quizData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/lecturer-dashboard');
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError('Failed to create quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-text mb-2">Quiz Created Successfully!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/lecturer-dashboard')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quiz Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                placeholder="e.g., Chapter 5 Practice Test"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-800 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div>
              <label htmlFor="chapter" className="block text-sm font-semibold text-gray-800 mb-2">
                Chapter *
              </label>
              <select
                id="chapter"
                name="chapter"
                required
                value={formData.chapter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
              >
                <option value="">Select Chapter</option>
                {chapters[formData.subject]?.map(chapter => (
                  <option key={chapter} value={chapter}>{chapter}</option>
                ))}
              </select>
            </div>



            {/* Number of Questions */}
            <div>
              <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions *
              </label>
              <input
                type="number"
                id="numberOfQuestions"
                name="numberOfQuestions"
                required
                min="1"
                max="50"
                value={formData.numberOfQuestions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available questions: {availableQuestions.length}
              </p>
            </div>

            {/* Time Limit */}
            <div>
              <label htmlFor="timeLimitMinutes" className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes) *
              </label>
              <input
                type="number"
                id="timeLimitMinutes"
                name="timeLimitMinutes"
                required
                min="5"
                max="180"
                value={formData.timeLimitMinutes}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Generate Questions Button */}
            {formData.chapter && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Step 2: Select Questions</h3>
                    <p className="text-sm text-blue-700 mt-1">Click to randomly select {formData.numberOfQuestions} questions from {formData.chapter}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateQuestions}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                  >
                    Select Questions ({formData.numberOfQuestions})
                  </button>
                </div>
                {selectedQuestionObjects.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-800 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        ✓ {selectedQuestionObjects.length} questions selected successfully!
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Preview Questions
                      </button>
                    </div>
                  </div>
                )}
                {availableQuestions.length > 0 ? (
                  <p className="text-xs text-blue-600 mt-2">
                    Available questions in this chapter: {availableQuestions.length}
                  </p>
                ) : (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      ⚠️ No questions found for this chapter. Add comprehensive question bank!
                    </p>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handlePopulateSampleQuestions}
                        disabled={populatingQuestions}
                        className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        {populatingQuestions ? 'Adding Sample Questions...' : 'Add Sample Questions'}
                      </button>


                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/lecturer-dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedQuestions.length === 0}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </div>
                ) : (
                  'Build Quiz'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Quiz Preview: {formData.title}</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                {selectedQuestionObjects.map((question, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Question {index + 1}: {question.questionText}
                      </h4>
                      <button
                        onClick={() => handleEditQuestion(question, index)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`flex items-center p-2 rounded ${
                          optIndex === question.correctOptionIndex
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-gray-50'
                        }`}>
                          <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium mr-3">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className={optIndex === question.correctOptionIndex ? 'text-green-800 font-medium' : 'text-gray-700'}>
                            {option}
                          </span>
                          {optIndex === question.correctOptionIndex && (
                            <span className="ml-2 text-green-600 text-sm">✓ Correct</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setShowPreview(false);
                  // Scroll to submit section
                  document.querySelector('form').scrollIntoView({ behavior: 'smooth', block: 'end' });
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Looks Good - Build Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Question</h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                  <textarea
                    value={editingQuestion.questionText}
                    onChange={(e) => setEditingQuestion({...editingQuestion, questionText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                  <div className="space-y-3">
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={editingQuestion.correctOptionIndex === index}
                          onChange={() => setEditingQuestion({...editingQuestion, correctOptionIndex: index})}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options];
                            newOptions[index] = e.target.value;
                            setEditingQuestion({...editingQuestion, options: newOptions});
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                  <textarea
                    value={editingQuestion.explanation || ''}
                    onChange={(e) => setEditingQuestion({...editingQuestion, explanation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    rows={2}
                    placeholder="Provide an explanation for the correct answer..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setEditingQuestion(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEditedQuestion(editingQuestion)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
