import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// ✅ NOVO: Import do CSS principal com Tailwind
import './index.css'

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('❌ Erro ao registrar Service Worker:', error);
      });
  });
}

// Initialize app - StrictMode restaurado após correção do useAuth.js
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)