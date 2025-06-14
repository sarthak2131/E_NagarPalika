import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Loader2, Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react'

// Status Badge Component
const StatusBadge = ({ status }) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Format Date Helper
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

// View Application Modal
const ViewModal = ({ application, onClose }) => {
  if (!application) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Application Details</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Information */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Number</h3>
              <p className="text-lg font-semibold dark:text-white">{application.ticketNo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</h3>
              <p className="text-lg dark:text-white">{formatDate(application.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
              <StatusBadge status={application.status} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</h3>
              <p className="text-lg dark:text-white">{application.currentLevel}</p>
            </div>
          </div>

          {/* Employee Information */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="font-medium dark:text-white">{application.employeeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Employee Code</p>
                <p className="font-medium dark:text-white">{application.employeeCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Designation</p>
                <p className="font-medium dark:text-white">{application.designation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Section</p>
                <p className="font-medium dark:text-white">{application.section}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                <p className="font-medium dark:text-white">{application.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium dark:text-white">{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ULB Code</p>
                <p className="font-medium dark:text-white">{application.ulbCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                <p className="font-medium dark:text-white">{application.userId}</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Request Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Nature of Request</p>
                <div className="flex flex-wrap gap-2">
                  {application.natureOfRequest.map((item, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Source System</p>
                <div className="flex flex-wrap gap-2">
                  {application.sourceSystem.map((item, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {application.tcodeList && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">T-Code List</p>
                  <p className="font-medium dark:text-white">{application.tcodeList}</p>
                </div>
              )}
            </div>
          </div>

          {/* Approval Flow */}
          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Approval Flow</h3>
            <div className="space-y-2">
              {['CMO', 'NodalOfficer', 'Commissioner'].map((level, index) => (
                <div key={level} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    application.previousLevels.includes(level) 
                      ? 'bg-green-500' 
                      : application.currentLevel === level 
                        ? 'bg-yellow-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                  <span className={`${
                    application.currentLevel === level 
                      ? 'font-semibold text-yellow-600 dark:text-yellow-400'
                      : application.previousLevels.includes(level)
                        ? 'font-medium text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          {application.remarks && (
            <div className="border-t dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Remarks</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-red-50 dark:bg-red-900/50 p-3 rounded">{application.remarks}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Reject Modal Component
const RejectModal = ({ onSubmit, onClose }) => {
  const [remarks, setRemarks] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!remarks.trim()) {
      setError('Please provide rejection remarks')
      return
    }
    onSubmit(remarks)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Rejection Remarks</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Please provide reason for rejection
            </label>
            <textarea
              className="form-input min-h-[100px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={remarks}
              onChange={(e) => {
                setRemarks(e.target.value)
                setError('')
              }}
              placeholder="Enter rejection remarks..."
            />
            {error && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-secondary"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [filter, setFilter] = useState('pending')
  const [sortOrder, setSortOrder] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectingApplicationId, setRejectingApplicationId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchApplications()
  }, [filter, token, navigate])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(
        `http://localhost:5000/api/applications?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setApplications(response.data)
    } catch (error) {
      console.error('Error fetching applications:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        navigate('/login')
      } else {
        setError('Failed to fetch applications. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, action, remarks = '') => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${id}`,
        { action, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchApplications()
    } catch (error) {
      console.error('Error updating application:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('username')
        navigate('/login')
      } else {
        alert('Error updating application status')
      }
    }
  }

  const handleReject = (id) => {
    setRejectingApplicationId(id)
    setShowRejectModal(true)
  }

  const handleRejectSubmit = (remarks) => {
    handleAction(rejectingApplicationId, 'reject', remarks)
    setShowRejectModal(false)
    setRejectingApplicationId(null)
  }

  const filteredAndSortedApplications = applications
    .filter(app => 
      app.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome, {role}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="     Search applications..."
              className="form-input pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={20} className="text-gray-400" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="form-input dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-600 dark:text-gray-400" size={40} />
        </div>
      ) : filteredAndSortedApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No applications found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredAndSortedApplications.map((app) => (
            <div key={app._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="space-y-2 mb-4 md:mb-0">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-semibold dark:text-white">Ticket: {app.ticketNo}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Employee: {app.employeeName}</p>
                  <p className="text-gray-600 dark:text-gray-400">Employee Code: {app.employeeCode}</p>
                  <p className="text-gray-600 dark:text-gray-400">Current Level: {app.currentLevel}</p>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>{formatDate(app.createdAt)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => setSelectedApplication(app)}
                    className="inline-flex items-center justify-center btn-secondary"
                  >
                    <Eye size={18} className="mr-2" />
                    View Details
                  </button>
                  
                  {app.currentLevel === role && app.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleAction(app._id, 'approve')}
                        className="inline-flex items-center justify-center btn-primary"
                      >
                        <CheckCircle size={18} className="mr-2" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(app._id)}
                        className="inline-flex items-center justify-center btn-secondary"
                      >
                        <XCircle size={18} className="mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedApplication && (
        <ViewModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}

      {showRejectModal && (
        <RejectModal
          onSubmit={handleRejectSubmit}
          onClose={() => {
            setShowRejectModal(false)
            setRejectingApplicationId(null)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard