import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Remove the preloader element (if present) after React mounts
const removePreloader = () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  try {
    pre.style.transition = 'opacity 240ms ease';
    pre.style.opacity = '0';
    setTimeout(() => pre.remove(), 300);
  } catch (e) {
    // fallback: remove immediately
    pre.remove();
  }
};

// Schedule removal on next tick to ensure mount finished
setTimeout(removePreloader, 0);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
