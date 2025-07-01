import React, { useState } from 'react'
import axios from 'axios'
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { endpoints } from '../config/api'
import toast from 'react-hot-toast'

const StatusBadge = ({ status, currentLevel }) => {
  if (status === 'pending' && ['ITAssistant', 'ITOfficer', 'ITHead'].includes(currentLevel)) {
    return (
      <span className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        <Clock size={16} className="mr-1" />
        Forwarded to {currentLevel.replace('IT', 'IT ').replace('Employee', 'Employee').toUpperCase()}
      </span>
    )
  }
  let displayStatus = status;
  let color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  let icon = <Clock size={16} className="mr-1" />;
  if (status === 'approved' && currentLevel !== 'Completed') {
    displayStatus = 'Partially Approved';
    color = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    icon = <CheckCircle size={16} className="mr-1" />;
  } else if (status === 'approved' && currentLevel === 'Completed') {
    displayStatus = 'Approved';
    color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    icon = <CheckCircle size={16} className="mr-1" />;
  } else if (status === 'rejected') {
    displayStatus = 'Rejected';
    color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    icon = <XCircle size={16} className="mr-1" />;
  }
  return (
    <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {icon}
      {displayStatus}
    </span>
  );
}

const ApplicationDetails = ({ application }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-8 border border-white/40 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold dark:text-white">Application Details</h2>
        <StatusBadge status={application.status} currentLevel={application.currentLevel} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ticket Number</h3>
            <p className="mt-1 text-lg font-bold dark:text-white">{application.ticketNo}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Level</h3>
            <p className="mt-1 text-base dark:text-gray-300">{application.currentLevel.replace('IT', 'IT ').replace('Employee', 'Employee').toUpperCase()}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Submission Date</h3>
            <p className="mt-1 text-base dark:text-gray-300">{formatDate(application.createdAt)}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Employee Details</h3>
            <p className="font-medium dark:text-white">{application.employeeName}</p>
            <p className="text-sm dark:text-gray-300">Employee Code: {application.employeeCode}</p>
            <p className="text-sm dark:text-gray-300">Designation: {application.designation}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Contact Information</h3>
            <p className="text-sm dark:text-gray-300">Email: {application.email}</p>
            <p className="text-sm dark:text-gray-300">Mobile: {application.mobile}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Nature of Request</h3>
          <div className="flex flex-wrap gap-2">
            {application.natureOfRequest.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Source System</h3>
          <div className="flex flex-wrap gap-2">
            {application.sourceSystem.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {application.remarks && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/40 rounded-lg border border-red-200 dark:border-red-700">
          <h3 className="text-xs font-semibold text-red-600 dark:text-red-300 uppercase tracking-wide mb-1">Remarks</h3>
          <p className="text-gray-800 dark:text-gray-200">{application.remarks}</p>
        </div>
      )}
    </div>
  )
}

const TrackStatus = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [application, setApplication] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      toast.error('Please enter a Ticket No. or Email ID')
      setError('Please enter a Ticket No. or Email ID')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${endpoints.applications.track}?query=${searchQuery}`)
      setApplication(response.data)
      toast.success('Application found!')
    } catch (error) {
      toast.error('Application not found. Please check the Ticket No. or Email ID')
      setError('Application not found. Please check the Ticket No. or Email ID')
      setApplication(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white tracking-tight">
        Track Application Status
      </h1>
      
      <div className="mb-8 flex justify-center">
        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div className="flex items-center bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg px-4 py-2 border border-blue-100 dark:border-gray-800">
            <input
              type="text"
              placeholder="Enter Ticket No. or Email ID"
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 px-2 py-3"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setError('')
              }}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              className="ml-2 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
              aria-label="Track"
            >
              {loading ? (
                <Search className="animate-spin" size={24} />
              ) : (
                <Search size={24} />
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="text-center text-red-500 mt-4">
          {error}
        </div>
      )}

      {application && (
        <div className="backdrop-blur-lg bg-white/60 dark:bg-gray-900/70 border border-white/40 dark:border-gray-700 rounded-2xl shadow-xl p-8">
          <ApplicationDetails application={application} />
        </div>
      )}
    </div>
  )
}

export default TrackStatus