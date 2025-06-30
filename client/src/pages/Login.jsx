import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { endpoints } from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(endpoints.auth.login, credentials, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.data.success) {
        // Store token and user details
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username);
        // Store user details for autofill if provided
        if (response.data.userDetails) {
          localStorage.setItem('userDetails', JSON.stringify(response.data.userDetails));
          if (response.data.userDetails.employeeName) {
            localStorage.setItem('employeename', response.data.userDetails.employeeName);
          } else {
            localStorage.removeItem('employeename');
          }
        }
        navigate('/dashboard');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 rounded-3xl shadow-2xl p-10 md:p-14 flex flex-col items-center w-full max-w-md mx-4">
        <AnimatedLogo />
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mt-6 mb-2 tracking-tight text-center">
          Officer Login
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Sign in to access your dashboard</p>
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg w-full text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="form-input rounded-xl bg-white/80 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              disabled={loading}
              placeholder="Enter your Email"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="form-input rounded-xl bg-white/80 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-700 focus:ring-2 focus:ring-blue-400"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              disabled={loading}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AnimatedLogo = () => (
  <svg className="w-20 h-20 animate-pulse" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="40" fill="#2563eb" fillOpacity="0.15" />
    <circle cx="50" cy="50" r="28" fill="#2563eb" fillOpacity="0.25" />
    <circle cx="50" cy="50" r="16" fill="#2563eb" />
    <text x="50" y="57" textAnchor="middle" fontSize="2.5rem" fill="#fff" fontWeight="bold">ई</text>
  </svg>
)

export default Login;