import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages';
import AuthenticatedRoutes from './AuthenticatedRoutes'
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient';
import { useStateContext } from './contexts/ContextProvider';
import  Nav  from './pages/landing/Nav';
import { useSelector } from 'react-redux';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext();
  const { userInfo } = useSelector((state) => state.auth);

//   const { setUser,currentUser} = useAuth();
// const [Token, setToken] =useState(null);
// const [authenticate, setAuthenticate]=useState(false);
  // State variables to track condition and number of times condition is true
  // const [conditionTrueCount, setConditionTrueCount] = useState(0);


  // Fetch currentUser from localStorage when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const currentThemeColor = localStorage.getItem('colorMode');
      const currentThemeMode = localStorage.getItem('themeMode');
      if (currentThemeColor && currentThemeMode) {
        setCurrentColor(currentThemeColor);
        setCurrentMode(currentThemeMode);
      }

      // const token = localStorage.getItem('token');
      // if (token && conditionTrueCount < 50) {
      // setToken({token})
      // setAuthenticate(true);
      
      //   setConditionTrueCount(prevCount => prevCount + 1);
      // }

      // if (conditionTrueCount < 50) {

      // const storedUser = localStorage.getItem('currentUser');
   
      //   const parsedUser = JSON.parse(storedUser);
      //   setUser(parsedUser);
      //   setConditionTrueCount(prevCount => prevCount + 1);
      // }

    };

    fetchData();
  }, []);

  return (
    <ApolloProvider client={client}>
   
   <Nav/>
        <div className={currentMode === 'Dark' ? 'dark' : ''}>
          <Routes>
         
        
          {userInfo ? (
              <Route path="/*" element={<AuthenticatedRoutes />} />
            ) : (
              <Route path="/login" element={<Landing />} />
            )}
          </Routes>
        </div>
       
    </ApolloProvider>
  );
};

export default App;
