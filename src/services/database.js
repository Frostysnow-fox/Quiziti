import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// Users Collection
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message };
  }
};

// Questions Collection
export const createQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...questionData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, error: error.message };
  }
};

export const getQuestions = async (filters = {}) => {
  try {
    let q = collection(db, 'questions');

    if (filters.subject) {
      q = query(q, where('subject', '==', filters.subject));
    }
    if (filters.chapter) {
      q = query(q, where('chapter', '==', filters.chapter));
    }
    if (filters.authorId) {
      q = query(q, where('authorId', '==', filters.authorId));
    }

    const querySnapshot = await getDocs(q);
    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: questions };
  } catch (error) {
    console.error('Error getting questions:', error);
    return { success: false, error: error.message };
  }
};

export const getQuestionsByIds = async (questionIds) => {
  try {
    const questions = [];
    for (const id of questionIds) {
      const questionDoc = await getDoc(doc(db, 'questions', id));
      if (questionDoc.exists()) {
        questions.push({ id: questionDoc.id, ...questionDoc.data() });
      }
    }
    return { success: true, data: questions };
  } catch (error) {
    console.error('Error getting questions by IDs:', error);
    return { success: false, error: error.message };
  }
};

// Quizzes Collection
export const createQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      isActive: true, // Default to active
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { success: false, error: error.message };
  }
};

export const getQuizzes = async (creatorId = null) => {
  try {
    const collectionRef = collection(db, 'quizzes');
    let q = collectionRef;

    if (creatorId) {
      // Try both creatorId and createdBy fields for compatibility
      q = query(q, where('createdBy', '==', creatorId));
    }

    const querySnapshot = await getDocs(q);
    const quizzes = [];

    querySnapshot.forEach((doc) => {
      try {
        const data = doc.data();

        // Debug: Log quiz data to see what fields are available
        console.log('Quiz data for', doc.id, ':', {
          title: data.title,
          questions: data.questions ? data.questions.length : 'No questions field',
          questionsArray: Array.isArray(data.questions),
          hasQuestions: !!data.questions
        });

        quizzes.push({ id: doc.id, ...data });
      } catch (docError) {
        console.error('Error processing quiz document:', doc.id, docError);
      }
    });

    return { success: true, data: quizzes };
  } catch (error) {
    console.error('Error getting quizzes:', error);
    return { success: false, error: error.message };
  }
};

export const getQuiz = async (quizId) => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (quizDoc.exists()) {
      return { success: true, data: { id: quizDoc.id, ...quizDoc.data() } };
    } else {
      return { success: false, error: 'Quiz not found' };
    }
  } catch (error) {
    console.error('Error getting quiz:', error);
    return { success: false, error: error.message };
  }
};

// Quiz Attempts Collection
export const createQuizAttempt = async (attemptData) => {
  try {
    const docRef = await addDoc(collection(db, 'quizAttempts'), {
      ...attemptData,
      dateTaken: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating quiz attempt:', error);
    return { success: false, error: error.message };
  }
};

// Check if student has already attempted a quiz
export const hasStudentAttemptedQuiz = async (studentId, quizId) => {
  try {
    const q = query(
      collection(db, 'quizAttempts'),
      where('studentId', '==', studentId),
      where('quizId', '==', quizId)
    );

    const querySnapshot = await getDocs(q);
    const hasAttempted = !querySnapshot.empty;

    return { success: true, hasAttempted };
  } catch (error) {
    console.error('Error checking quiz attempt:', error);
    return { success: false, error: error.message, hasAttempted: false };
  }
};

export const getQuizAttempts = async (filters = {}) => {
  try {
    // Start with base collection
    const collectionRef = collection(db, 'quizAttempts');
    let q = collectionRef;

    // Apply filters if provided
    if (filters.studentId) {
      q = query(q, where('studentId', '==', filters.studentId));
    }
    if (filters.quizId) {
      q = query(q, where('quizId', '==', filters.quizId));
    }

    const querySnapshot = await getDocs(q);
    const attempts = [];

    querySnapshot.forEach((doc) => {
      try {
        const data = doc.data();

        // Handle legacy data where score was stored as percentage
        let actualScore = data.score || 0;
        let actualPercentage = data.percentage;

        // Legacy data detection and conversion
        if (data.totalQuestions > 0) {
          // If percentage is missing or score seems to be percentage (score > totalQuestions)
          if (!actualPercentage || data.score > data.totalQuestions) {
            // This is legacy data where score was actually percentage
            actualPercentage = data.score; // score was actually percentage
            actualScore = Math.round((data.score / 100) * data.totalQuestions); // calculate correct answers

            console.log(`Legacy data detected for attempt ${doc.id}:`, {
              oldScore: data.score,
              newScore: actualScore,
              percentage: actualPercentage,
              totalQuestions: data.totalQuestions
            });
          } else if (actualPercentage === undefined || actualPercentage === null) {
            // Calculate percentage from score if missing
            actualPercentage = Math.round((data.score / data.totalQuestions) * 100);
          }
        }

        const attempt = {
          id: doc.id,
          ...data,
          // Use corrected values
          score: actualScore, // Number of correct answers
          percentage: actualPercentage || 0, // Percentage score
          // Ensure dateTaken exists and is properly formatted
          dateTaken: data.dateTaken || new Date(),
          // Add completedAt alias for compatibility
          completedAt: data.dateTaken || data.completedAt || new Date()
        };

        attempts.push(attempt);
      } catch (docError) {
        console.error('Error processing document:', doc.id, docError);
      }
    });

    // Sort by dateTaken (most recent first)
    attempts.sort((a, b) => {
      try {
        const dateA = a.dateTaken?.toDate ? a.dateTaken.toDate() : new Date(a.dateTaken);
        const dateB = b.dateTaken?.toDate ? b.dateTaken.toDate() : new Date(b.dateTaken);
        return dateB - dateA;
      } catch (sortError) {
        console.error('Error sorting attempts:', sortError);
        return 0;
      }
    });

    return { success: true, data: attempts };

  } catch (error) {
    console.error('Error in getQuizAttempts:', error);
    return { success: false, error: error.message };
  }
};

// Update question
export const updateQuestion = async (questionId, questionData) => {
  try {
    const docRef = doc(db, 'questions', questionId);
    await updateDoc(docRef, questionData);
    return { success: true };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, error: error.message };
  }
};

// Toggle quiz active status
export const toggleQuizStatus = async (quizId, isActive) => {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    await updateDoc(docRef, { isActive });
    return { success: true };
  } catch (error) {
    console.error('Error updating quiz status:', error);
    return { success: false, error: error.message };
  }
};

// Get questions for question bank
export const getQuestionsByLecturer = async (lecturerId) => {
  try {
    const questionsRef = collection(db, 'questions');
    const q = query(questionsRef, where('createdBy', '==', lecturerId));
    const snapshot = await getDocs(q);

    const questions = [];
    snapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      success: true,
      data: questions
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Cleanup corrupted score data
export const cleanupScoreData = async () => {
  try {
    const attemptsRef = collection(db, 'quizAttempts');
    const snapshot = await getDocs(attemptsRef);

    let fixedCount = 0;
    const batch = writeBatch(db);

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let needsUpdate = false;
      const updates = {};

      // Fix percentage over 100% or missing data
      if (data.percentage > 100 || data.percentage === 0) {
        if (data.score && data.totalQuestions && data.totalQuestions > 0) {
          // If score looks like correct answers count
          if (data.score <= data.totalQuestions) {
            updates.percentage = Math.round((data.score / data.totalQuestions) * 100);
            needsUpdate = true;
          }
          // If score looks like it was stored as percentage
          else if (data.score <= 100) {
            updates.percentage = data.score;
            updates.score = Math.round((data.score / 100) * data.totalQuestions);
            needsUpdate = true;
          }
        }
      }

      // Fix missing totalQuestions by fetching from quiz
      if (!data.totalQuestions && data.quizId) {
        try {
          const quizDoc = await getDoc(doc(db, 'quizzes', data.quizId));
          if (quizDoc.exists()) {
            const quizData = quizDoc.data();
            if (quizData.questions && quizData.questions.length > 0) {
              updates.totalQuestions = quizData.questions.length;
              needsUpdate = true;

              // Recalculate percentage if we now have totalQuestions
              if (data.score && !updates.percentage) {
                updates.percentage = Math.round((data.score / updates.totalQuestions) * 100);
              }
            }
          }
        } catch (quizError) {
          console.error('Error fetching quiz for attempt:', doc.id, quizError);
        }
      }

      if (needsUpdate) {
        batch.update(doc.ref, updates);
        fixedCount++;
        console.log(`Fixing attempt ${doc.id}:`, updates);
      }
    }

    if (fixedCount > 0) {
      await batch.commit();
      return {
        success: true,
        message: `Fixed ${fixedCount} quiz attempt records`
      };
    } else {
      return {
        success: true,
        message: 'No data issues found - all records are correct'
      };
    }

  } catch (error) {
    console.error('Error cleaning up score data:', error);
    return { success: false, error: error.message };
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const questionRef = doc(db, 'questions', questionId);
    await deleteDoc(questionRef);

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting question:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
