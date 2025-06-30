  import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const employeename = localStorage.getItem('employeename');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('employeename');
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to get initials from employeename
  // Fix: Always fallback to username/email if employeename is missing or invalid
  const getEmployeeInitials = (name, username) => {
    // Prefer employeename, fallback to username/email
    let displayName = name && name.trim() !== '' ? name.trim() : (username || '');
    if (!displayName) return '?';

    // If it's an email, use first letter before @
    if (displayName.includes('@')) {
      const firstChar = displayName[0];
      if (/[\p{L}\p{N}]/u.test(firstChar)) return firstChar.toUpperCase();
      // Try next character if first is not valid
      for (let i = 1; i < displayName.length; i++) {
        if (/[\p{L}\p{N}]/u.test(displayName[i])) return displayName[i].toUpperCase();
      }
      return '?';
    }

    // Otherwise, use initials from name
    const words = displayName.split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) {
      const initial = words[0][0];
      if (/[\p{L}\p{N}]/u.test(initial)) return initial.toUpperCase();
      // Try next character in the word
      for (let i = 1; i < words[0].length; i++) {
        if (/[\p{L}\p{N}]/u.test(words[0][i])) return words[0][i].toUpperCase();
      }
      return '?';
    }
    // Two or more words: take first char of first two words
    const firstInitial = words[0][0];
    const secondInitial = words[1][0];
    let initials = '';
    if (/[\p{L}\p{N}]/u.test(firstInitial)) initials += firstInitial.toUpperCase();
    if (/[\p{L}\p{N}]/u.test(secondInitial)) initials += secondInitial.toUpperCase();
    if (initials.length > 0) return initials;
    // Fallback: try to find any valid character in first two words
    for (let w = 0; w < 2 && w < words.length; w++) {
      for (let i = 0; i < words[w].length; i++) {
        if (/[\p{L}\p{N}]/u.test(words[w][i])) {
          initials += words[w][i].toUpperCase();
          if (initials.length === 2) return initials;
          break;
        }
      }
    }
    return initials.length > 0 ? initials : '?';
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-xl rounded-b-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <AnimatedLogo />
              <span className="text-2xl font-bold text-blue-700 dark:text-blue-300 tracking-wide">Nagarpalika</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Hamburger for mobile */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Open main menu"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
            <Link to="/form" className="rounded-full px-4 py-2 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">Fill Form</Link>
            <Link to="/track" className="rounded-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 transition">Track Status</Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="rounded-full px-4 py-2 bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition">Dashboard</Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="flex items-center space-x-2 focus:outline-none group"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white font-bold text-lg shadow">
                      {getEmployeeInitials(employeename, username)}
                    </span>
                    {(employeename || username) && (
                      <span className="ml-2 text-base font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
                        {employeename ? employeename : username}
                      </span>
                    )}
                    <svg className={`w-4 h-4 text-blue-700 dark:text-blue-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 animate-fade-in z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="rounded-full px-4 py-2 bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition">Login</Link>
            )}
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg border border-blue-100 dark:border-gray-800 py-4 px-4 space-y-2 animate-fade-in">
            <Link to="/form" className="block rounded-full px-4 py-2 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition" onClick={() => setMobileMenuOpen(false)}>Fill Form</Link>
            <Link to="/track" className="block rounded-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 transition" onClick={() => setMobileMenuOpen(false)}>Track Status</Link>
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="block rounded-full px-4 py-2 bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((open) => !open)}
                    className="flex items-center space-x-2 focus:outline-none group w-full mt-2"
                  >
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-500 text-white font-bold text-lg shadow">
                      {getEmployeeInitials(employeename, username)}
                    </span>
                    {(employeename || username) && (
                      <span className="ml-2 text-base font-medium text-gray-800 dark:text-gray-200 max-w-[120px] truncate">
                        {employeename ? employeename : username}
                      </span>
                    )}
                    <svg className={`w-4 h-4 text-blue-700 dark:text-blue-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 ring-1 ring-black ring-opacity-5 animate-fade-in z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="block rounded-full px-4 py-2 bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const AnimatedLogo = () => (
  <svg className="w-10 h-10 animate-pulse" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="40" fill="#2563eb" fillOpacity="0.15" />
    <circle cx="50" cy="50" r="28" fill="#2563eb" fillOpacity="0.25" />
    <circle cx="50" cy="50" r="16" fill="#2563eb" />
    <text x="50" y="57" textAnchor="middle" fontSize="2.5rem" fill="#fff" fontWeight="bold">ई</text>
  </svg>
)

export default Navbar;