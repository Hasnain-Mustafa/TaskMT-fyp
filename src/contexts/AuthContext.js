// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (token) => {
    // setUser({ token });
    localStorage.setItem('token', token);
    
    return true;
  };

  const logout = () => {

    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
