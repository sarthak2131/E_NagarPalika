import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Form from './pages/Form'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TrackStatus from './pages/TrackStatus'
import Profile from './pages/Profile'
import './index.css'

function App() {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative overflow-hidden"
      style={{
        backgroundImage: "url('/premium_photo-1697730395452-e90ac9269968.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.7)",
        backgroundAttachment: "fixed"
      }}
    >
      <div className="fixed inset-0 bg-white/40 dark:bg-gray-900/70 z-10 pointer-events-none" />
      <div className="relative z-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App