import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1a41bc] mb-4">
          Welcome to ई-Nagarpalika
        </h1>
        <p className="text-xl mb-8">
          User ID Creation and Authorization Management Portal
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/form" className="btn-primary text-lg">
            Create New Request
          </Link>
          <Link to="/track" className="btn-secondary text-lg">
            Track Your Request
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home