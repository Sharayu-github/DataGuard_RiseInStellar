import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (walletAddress) => {
    try {
      setIsLoading(true);
      // Call backend to authenticate with wallet address
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthToken(data.token);
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, authToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
