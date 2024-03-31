import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { AuthProvider } from './contexts/AuthContext';
import { Provider } from 'react-redux'
import store from './app/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
   <BrowserRouter>
    <AuthProvider>
    <ContextProvider>
    
      <App />
   
    </ContextProvider>
    </AuthProvider>
 
   </BrowserRouter>
</Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
