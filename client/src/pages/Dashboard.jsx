import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Loader2, Search, Filter, Eye, CheckCircle, XCircle, Clock, ListChecks, FileText } from 'lucide-react'
import { endpoints } from '../config/api'

const summaryColors = {
  total: 'bg-gradient-to-r from-blue-400 to-blue-600',
  pending: 'bg-gradient-to-r from-yellow-300 to-yellow-500',
  approved: 'bg-gradient-to-r from-green-400 to-green-600',
  rejected: 'bg-gradient-to-r from-red-400 to-red-600',
}

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} className="mr-1" /> },
    approved: { color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} className="mr-1" /> },
    rejected: { color: 'bg-red-100 text-red-800', icon: <XCircle size={16} className="mr-1" /> },
  }
  const c = config[status] || config.pending
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${c.color}`}>
      {c.icon}
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
const ViewModal = ({ application, onClose, userRole }) => {
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
              {application.statusMessage && (
                <div className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{application.statusMessage}</div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Level</h3>
              <p className="text-lg dark:text-white">{application.currentLevel.replace('IT', 'IT ').replace('Employee', 'Employee').toUpperCase()}</p>
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
              {['ITAssistant', 'ITOfficer', 'ITHead'].map((level, index) => (
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
                    {level.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons for Approve/Reject */}
          {userRole && (
            (userRole === 'ITHead' && application.status !== 'rejected' && application.currentLevel !== 'Completed') ||
            (userRole === 'ITOfficer' && (application.currentLevel === 'ITAssistant' || application.currentLevel === 'ITOfficer') && application.status === 'pending') ||
            (userRole === 'ITAssistant' && application.currentLevel === 'ITAssistant' && application.status === 'pending')
          ) && (
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  onClose();
                  window.handleAction && window.handleAction(application._id, 'approve');
                }}
                className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  onClose();
                  window.handleReject && window.handleReject(application._id);
                }}
                className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          )}

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
  const [filter, setFilter] = useState('all')
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
    window.handleAction = handleAction;
    window.handleReject = handleReject;
    return () => {
      window.handleAction = undefined;
      window.handleReject = undefined;
    }
  }, [token])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(endpoints.applications.getAll, {
        headers: { Authorization: `Bearer ${token}` }
      })
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
        endpoints.applications.update(id),
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

  // Summary counts
  const summary = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  // Filtered applications
  const filteredApps = applications
    .filter(app => {
      if (filter === 'all') return true;
      if (filter === 'final-approved') return app.status === 'approved' && app.currentLevel === 'Completed';
      if (filter === 'partially-approved') return app.status === 'approved' && app.currentLevel !== 'Completed';
      if (filter === 'pending') {
        if (role === 'ITHead') {
          return app.currentLevel === 'ITHead' && (app.status === 'pending' || app.status === 'approved');
        }
        return app.status === 'pending';
      }
      return app.status === filter;
    })
    .filter(app =>
      app.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 dark:text-white tracking-tight text-center">Dashboard</h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard label="Total" value={summary.total} icon={<ListChecks size={28} />} color={summaryColors.total} />
        <SummaryCard label="Pending" value={summary.pending} icon={<Clock size={28} />} color={summaryColors.pending} />
        <SummaryCard label="Approved" value={summary.approved} icon={<CheckCircle size={28} />} color={summaryColors.approved} />
        <SummaryCard label="Rejected" value={summary.rejected} icon={<XCircle size={28} />} color={summaryColors.rejected} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-input rounded-full bg-white/60 dark:bg-gray-900/70 border-none shadow text-gray-800 dark:text-white backdrop-blur-md"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="final-approved">Final Approved</option>
            <option value="partially-approved">Partially Approved</option>
          </select>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by Ticket, Name, or Code..."
            className="form-input pl-10 rounded-full bg-white/60 dark:bg-gray-900/70 border-none shadow focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition text-gray-800 dark:text-white backdrop-blur-md w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Application List */}
      <div className="bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg border border-white/40 dark:border-gray-700 rounded-2xl shadow-xl p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-blue-600 dark:text-blue-300" size={40} />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 py-8">{error}</div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">No applications found.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredApps.map(app => (
              <li key={app._id} className="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-blue-300 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow">
                    <FileText size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg dark:text-white">{app.ticketNo}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    {app.statusMessage && (
                      <div className="mt-1 text-xs font-semibold text-blue-700 dark:text-blue-300">{app.statusMessage}</div>
                    )}
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {app.employeeName} &bull; {app.employeeCode}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2">
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                    {new Date(app.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="rounded-full px-4 py-2 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedApplication && (
        <ViewModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
          userRole={role}
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

const SummaryCard = ({ label, value, icon, color }) => (
  <div className={`rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center text-white ${color}`}>
    <div className="mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm font-medium tracking-wide">{label}</div>
  </div>
)

export default Dashboard