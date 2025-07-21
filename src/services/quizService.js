import { getQuestions, createQuiz, getQuiz, getQuestionsByIds } from './database';

// Generate a quiz with random questions based on criteria
export const generateQuiz = async (criteria) => {
  try {
    const { subject, chapter, numberOfQuestions } = criteria;

    // Get questions based on criteria (no topic field)
    const questionsResult = await getQuestions({
      subject,
      chapter
    });

    if (!questionsResult.success) {
      return { success: false, error: questionsResult.error };
    }

    const availableQuestions = questionsResult.data;

    if (!availableQuestions || availableQuestions.length === 0) {
      return {
        success: false,
        error: `No questions found for ${subject} > ${chapter}. Please add questions first using the "Add Question" feature.`
      };
    }

    if (availableQuestions.length < numberOfQuestions) {
      return {
        success: false,
        error: `Not enough questions available. Found ${availableQuestions.length}, need ${numberOfQuestions}. Please add more questions or reduce the number of questions.`
      };
    }

    // Randomly select questions
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, numberOfQuestions);

    return {
      success: true,
      data: selectedQuestions.map(q => q.id)
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { success: false, error: error.message };
  }
};

// Calculate quiz score
export const calculateScore = (answers, questions) => {
  let correctAnswers = 0;
  const detailedAnswers = [];
  
  answers.forEach((answer, index) => {
    const question = questions[index];
    const isCorrect = answer.selectedOptionIndex === question.correctOptionIndex;
    
    if (isCorrect) {
      correctAnswers++;
    }
    
    detailedAnswers.push({
      questionId: question.id,
      selectedOptionIndex: answer.selectedOptionIndex,
      isCorrect
    });
  });
  
  const percentage = Math.round((correctAnswers / questions.length) * 100);

  return {
    score: correctAnswers, // Number of correct answers
    percentage, // Percentage score
    correctAnswers,
    totalQuestions: questions.length,
    answers: detailedAnswers
  };
};

// Get quiz with questions
export const getQuizWithQuestions = async (quizId) => {
  try {
    // Get quiz details
    const quizResult = await getQuiz(quizId);
    if (!quizResult.success) {
      return quizResult;
    }
    
    const quiz = quizResult.data;
    
    // Get questions for the quiz
    const questionsResult = await getQuestionsByIds(quiz.questionIds);
    if (!questionsResult.success) {
      return questionsResult;
    }
    
    return {
      success: true,
      data: {
        ...quiz,
        questions: questionsResult.data
      }
    };
  } catch (error) {
    console.error('Error getting quiz with questions:', error);
    return { success: false, error: error.message };
  }
};

// Validate quiz data
export const validateQuizData = (quizData) => {
  const errors = [];
  
  if (!quizData.title || quizData.title.trim().length === 0) {
    errors.push('Quiz title is required');
  }
  
  if (!quizData.chapter || quizData.chapter.trim().length === 0) {
    errors.push('Chapter is required');
  }
  
  if (!quizData.timeLimitMinutes || quizData.timeLimitMinutes <= 0) {
    errors.push('Time limit must be greater than 0');
  }
  
  if (!quizData.questionIds || quizData.questionIds.length === 0) {
    errors.push('At least one question is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate question data
export const validateQuestionData = (questionData) => {
  const errors = [];
  
  if (!questionData.questionText || questionData.questionText.trim().length === 0) {
    errors.push('Question text is required');
  }
  
  if (!questionData.options || questionData.options.length !== 4) {
    errors.push('Exactly 4 options are required');
  } else {
    questionData.options.forEach((option, index) => {
      if (!option || option.trim().length === 0) {
        errors.push(`Option ${index + 1} cannot be empty`);
      }
    });
  }
  
  if (questionData.correctOptionIndex === undefined || 
      questionData.correctOptionIndex < 0 || 
      questionData.correctOptionIndex > 3) {
    errors.push('A valid correct option must be selected');
  }
  
  if (!questionData.subject || questionData.subject.trim().length === 0) {
    errors.push('Subject is required');
  }
  
  if (!questionData.chapter || questionData.chapter.trim().length === 0) {
    errors.push('Chapter is required');
  }
  

  
  return {
    isValid: errors.length === 0,
    errors
  };
};
