import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <div className="container-responsive py-8 md:py-12">
        <div className="text-center space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a41bc] dark:text-blue-400 leading-tight">
            Welcome to ई-Nagarpalika
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            User ID Creation and Authorization Management Portal
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 px-4 sm:px-0">
            <Link 
              to="/form" 
              className="btn-primary w-full sm:w-auto text-center text-base md:text-lg py-3"
            >
              Create New Request
            </Link>
            <Link 
              to="/track" 
              className="btn-secondary w-full sm:w-auto text-center text-base md:text-lg py-3"
            >
              Track Your Request
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 md:mt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-[#1a41bc] dark:text-blue-400">Easy Application</h3>
              <p className="text-gray-600 dark:text-gray-300">Simple and intuitive form submission process for all your ID requirements.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-[#1a41bc] dark:text-blue-400">Real-time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">Track your application status in real-time with instant updates.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-4 text-[#1a41bc] dark:text-blue-400">Secure Process</h3>
              <p className="text-gray-600 dark:text-gray-300">Multi-level verification system ensuring complete security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home