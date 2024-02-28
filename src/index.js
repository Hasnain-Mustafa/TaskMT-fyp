import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from './contexts/AuthContext';
import { QueryResultProvider } from "./contexts/QueryResultContext";
import { GET_CURRENT_USER } from './GraphQL/Queries';

ReactDOM.render(
  <React.StrictMode>
  
    <AuthProvider>
    <ContextProvider>
    
      <App />
   
    </ContextProvider>
    </AuthProvider>
 
    
  </React.StrictMode>,
  document.getElementById('root'),
);
