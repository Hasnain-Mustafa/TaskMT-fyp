import React, { createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import client from '../ApolloClient';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [Token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); 

  const navigate = useNavigate(); // Get the navigate function

  const login = (token) => {
    setToken({ token });
    localStorage.setItem('token', token); 
 
    navigate('/dashboard');
    window.location.reload();
    
  };

  const setUser = (parsedUser) => {
    setCurrentUser(parsedUser);
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  
  navigate('/login');
  window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ Token, login, logout, setUser, currentUser, setCurrentUser, client }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
