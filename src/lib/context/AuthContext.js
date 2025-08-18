// lib/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users database
const mockUsers = {
  'rishika': { username: 'rishika', password: '1234', displayName: 'Rishika Sharma' },
  'riya': { username: 'riya', password: '1234', displayName: 'Riya Patel' },
  'rashee': { username: 'rashee', password: '1234', displayName: 'Rashee Singh' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in (check localStorage or session)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const user = mockUsers[username.toLowerCase()];
      
      if (user && user.password === password) {
        const userData = {
          username: user.username,
          displayName: user.displayName,
          isAuthenticated: true
        };
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // Changed from '/dashboard' to '/assessments'
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: 'Invalid username or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/auth/login');
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}