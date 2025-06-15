import React, { useState } from 'react'
import axios from 'axios'
import { Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { endpoints } from '../config/api'

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      icon: <Clock size={16} className="mr-1" />
    },
    approved: {
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      icon: <CheckCircle size={16} className="mr-1" />
    },
    rejected: {
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      icon: <XCircle size={16} className="mr-1" />
    }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold dark:text-white">Application Details</h2>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Number</h3>
            <p className="mt-1 text-lg font-semibold dark:text-white">{application.ticketNo}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</h3>
            <p className="mt-1 dark:text-gray-300">{application.currentLevel}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submission Date</h3>
            <p className="mt-1 dark:text-gray-300">{formatDate(application.createdAt)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee Details</h3>
            <p className="mt-1 dark:text-gray-300">{application.employeeName}</p>
            <p className="dark:text-gray-300">Employee Code: {application.employeeCode}</p>
            <p className="dark:text-gray-300">Designation: {application.designation}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</h3>
            <p className="mt-1 dark:text-gray-300">Email: {application.email}</p>
            <p className="dark:text-gray-300">Mobile: {application.mobile}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Nature of Request</h3>
          <div className="mt-2 flex flex-wrap gap-2">
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
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Source System</h3>
          <div className="mt-2 flex flex-wrap gap-2">
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

        {application.remarks && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarks</h3>
            <p className="mt-1 text-gray-800 dark:text-gray-200">{application.remarks}</p>
          </div>
        )}
      </div>
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
      setError('Please enter a Ticket No. or Email ID')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`${endpoints.applications.track}?query=${searchQuery}`)
      setApplication(response.data)
    } catch (error) {
      setError('Application not found. Please check the Ticket No. or Email ID')
      setApplication(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Track Application Status
      </h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Ticket No. "
              className="form-input pl-12 pr-4 py-3 w-full "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setError('')
              }}
              disabled={loading}
            />
        
            <button
              type="submit"
              className="absolute  top-1/2 transform -translate-y-1/2 btn-primary py-1"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}
      </div>

      {application && <ApplicationDetails application={application} />}
    </div>
  )
}

export default TrackStatus