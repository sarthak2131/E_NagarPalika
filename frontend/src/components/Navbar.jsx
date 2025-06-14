import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#1a41bc] dark:text-blue-400">
              ई-Nagarpalika
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/form" className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700">
              Fill Form
            </Link>
            <Link to="/track" className="btn-secondary dark:bg-orange-600 dark:hover:bg-orange-700">
              Track Status
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 dark:text-gray-300">{username}</span>
                  <button onClick={handleLogout} className="btn-secondary dark:bg-orange-600 dark:hover:bg-orange-700">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar