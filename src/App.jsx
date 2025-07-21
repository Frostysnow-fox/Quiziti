import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import CreateQuiz from './pages/CreateQuiz';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import ViewResults from './pages/ViewResults';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Application Error</h3>
            <p className="text-gray-600 mb-4">{this.state.error?.message || 'Something went wrong'}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Student Routes */}
              <Route
                path="/student-dashboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/take-quiz/:quizId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <TakeQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz-results/:attemptId"
                element={
                  <ProtectedRoute requiredRole="student">
                    <QuizResults />
                  </ProtectedRoute>
                }
              />

              {/* Lecturer Routes */}
              <Route
                path="/lecturer-dashboard"
                element={
                  <ProtectedRoute requiredRole="lecturer">
                    <LecturerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-quiz"
                element={
                  <ProtectedRoute requiredRole="lecturer">
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/view-results/:quizId"
                element={
                  <ProtectedRoute requiredRole="lecturer">
                    <ViewResults />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-quiz/:quizId"
                element={
                  <ProtectedRoute requiredRole="lecturer">
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
