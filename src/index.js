import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';

import { Provider } from 'react-redux'
import store from './app/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
   <BrowserRouter>
  
    <ContextProvider>
    
      <App />
   
    </ContextProvider>
   
 
   </BrowserRouter>
</Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
