import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Form from './pages/Form'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TrackStatus from './pages/TrackStatus'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/track" element={<TrackStatus />} />
      </Routes>
    </div>
  )
}

export default App