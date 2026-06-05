import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Mount React Application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Dismiss pre-hydration loader once React is initialized
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('root-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
});

// Immediate dismiss fallback in case DOMContentLoaded fired early
setTimeout(() => {
  const loader = document.getElementById('root-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 500);
  }
}, 800);
