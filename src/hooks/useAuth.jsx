import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChange, signIn, signOutUser } from '../services/auth';
import { getUser } from '../services/database';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        try {
          // Get user data from Firestore
          const userData = await getUser(user.uid);
          if (userData.success) {
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userData.data
            });
          } else {
            console.error('Error fetching user data:', userData.error);
            setCurrentUser({
              uid: user.uid,
              email: user.email
            });
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setCurrentUser({
            uid: user.uid,
            email: user.email
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signIn(email, password);
      if (result.success) {
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const result = await signOutUser();
      if (result.success) {
        setCurrentUser(null);
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
