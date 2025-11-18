import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Expose Vite env value to runtime code that can't reference import.meta
// directly (keeps `src/lib/api.js` free of `import.meta` usage).
try {
  // Vite replaces import.meta.env.VITE_API_URL at build/dev time
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    globalThis.__VITE_API_URL__ = import.meta.env.VITE_API_URL
  }
} catch (e) {
  // ignore in environments that don't support import.meta
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)