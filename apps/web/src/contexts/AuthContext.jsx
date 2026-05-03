
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(pb.authStore.model);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial state set from synchronous authStore
    setCurrentUser(pb.authStore.model);
    setIsLoading(false);

    // Subscribe to auth state changes across the app or tabs
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    // Ensure $autoCancel is false as per PocketBase rules
    const authData = await pb.collection('users').authWithPassword(email, password, { 
      $autoCancel: false 
    });
    setCurrentUser(authData.record);
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: pb.authStore.isValid,
    isAdmin: pb.authStore.model?.role === 'admin',
    isEditor: pb.authStore.model?.role === 'editor',
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
