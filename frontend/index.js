import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';

// Correct way to initialize and render your app in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
