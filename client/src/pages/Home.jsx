import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center relative">
      <img src="/premium_photo-1697730395452-e90ac9269968.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" style={{filter: 'brightness(0.7)'}} />
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/60 z-10" />
      <div className="relative z-20 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:p-16 flex flex-col items-center max-w-2xl w-full mx-4">
        <div className="mb-8 flex flex-col items-center">
          <img src="/image.png" alt="Logo" className="w-24 h-24 object-cover mb-3 rounded-full border-4 border-white dark:border-gray-800" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mt-6 mb-2 tracking-tight text-center">
            ई-Nagarpalika
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-xl">
            Welcome to the User ID Creation & Authorization Portal for Nagar Nigam IT Department
          </p>
        </div>
        <Link
          to="/form"
          className="mt-6 w-full md:w-auto px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow-lg transition text-center"
        >
          Start New Request
        </Link>
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full justify-center">
          <Link
            to="/track"
            className="rounded-full px-8 py-3 bg-white/80 dark:bg-gray-800/80 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 transition text-center"
          >
            Track Your Request
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full px-8 py-3 bg-white/80 dark:bg-gray-800/80 text-blue-700 dark:text-blue-300 font-semibold shadow hover:bg-blue-50 dark:hover:bg-gray-700 border border-blue-100 dark:border-gray-700 transition text-center"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home