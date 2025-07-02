import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              borderRadius: '12px',
              background: 'var(--tw-bg-opacity,1) #fff',
              color: '#222',
              boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
              fontWeight: 500,
              fontSize: '1rem',
              padding: '14px 20px',
              minWidth: '220px',
              maxWidth: '90vw',
            },
            className: 'dark:bg-gray-900 dark:text-white dark:shadow-2xl',
            success: {
              style: { background: '#e0fce0', color: '#166534' },
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              style: { background: '#fee2e2', color: '#991b1b' },
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
            loading: {
              style: { background: '#e0e7ff', color: '#3730a3' },
              iconTheme: { primary: '#6366f1', secondary: '#fff' },
            },
          }}
        />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)