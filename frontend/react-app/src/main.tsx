import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Performance Optimization: Enable React concurrent features
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Performance Optimization: Strict mode in development only
const AppWrapper = process.env.NODE_ENV === 'development' 
  ? React.StrictMode 
  : React.Fragment;

root.render(
  <AppWrapper>
    <App />
  </AppWrapper>
);