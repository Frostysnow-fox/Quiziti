import { createQuestion, createQuizAttempt } from './database';
import { sampleQuestions } from '../utils/sampleData';
import { generateAllQuestions } from '../utils/questionGenerator';

// Function to populate ALL sample questions (10 per topic = 480 total)
export const populateSampleQuestions = async () => {
  try {
    const results = [];

    // Generate all questions (10 per topic for all 48 topics)
    const allQuestions = generateAllQuestions();

    let addedCount = 0;
    for (const question of allQuestions) {
      try {
        const result = await createQuestion(question);
        results.push(result);
        if (result.success) {
          addedCount++;
        }
      } catch (error) {
        console.error('Error adding question:', error);
        results.push({ success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return {
      success: true,
      message: `Added ${successCount} questions to the database (10 questions per topic)`,
      details: results
    };
  } catch (error) {
    console.error('Error populating sample questions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to populate basic sample questions (original smaller set)
export const populateBasicSampleQuestions = async () => {
  try {
    const results = [];

    for (const question of sampleQuestions) {
      try {
        const result = await createQuestion(question);
        results.push(result);
      } catch (error) {
        console.error('Error adding question:', error);
        results.push({ success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    return {
      success: true,
      message: `Added ${successCount} basic sample questions to the database`,
      details: results
    };
  } catch (error) {
    console.error('Error populating basic sample questions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to check if sample questions exist
export const checkSampleQuestionsExist = async () => {
  try {
    // This is a simple check - in a real app you might want to check more thoroughly
    const { getQuestions } = await import('./database');
    const result = await getQuestions({ subject: 'Basic Electronics' });
    
    if (result.success && result.data.length > 0) {
      return { exists: true, count: result.data.length };
    }
    
    return { exists: false, count: 0 };
  } catch (error) {
    console.error('Error checking sample questions:', error);
    return { exists: false, count: 0, error: error.message };
  }
};

// Function to create sample quiz attempts for testing
export const createSampleQuizAttempts = async (quizId, studentId) => {
  try {
    const sampleAttempts = [
      {
        quizId: quizId,
        studentId: studentId,
        score: 85,
        timeTakenMinutes: 25,
        answers: [
          { questionId: 'q1', selectedOptionIndex: 0, isCorrect: true },
          { questionId: 'q2', selectedOptionIndex: 1, isCorrect: true },
          { questionId: 'q3', selectedOptionIndex: 2, isCorrect: false },
          { questionId: 'q4', selectedOptionIndex: 0, isCorrect: true },
          { questionId: 'q5', selectedOptionIndex: 1, isCorrect: true }
        ]
      }
    ];

    const results = [];
    for (const attempt of sampleAttempts) {
      const result = await createQuizAttempt(attempt);
      results.push(result);
    }

    return {
      success: true,
      message: `Created ${results.filter(r => r.success).length} sample quiz attempts`,
      details: results
    };
  } catch (error) {
    console.error('Error creating sample quiz attempts:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
