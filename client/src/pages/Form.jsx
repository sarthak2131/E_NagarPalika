import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { endpoints } from '../config/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const SuccessModal = ({ ticketNo, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Application Submitted!</h2>
        <p className="text-lg mb-4 dark:text-gray-300">Your ticket number is:</p>
        <p className="text-2xl font-bold text-[#1a41bc] dark:text-blue-400 mb-6">{ticketNo}</p>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Please save this ticket number for tracking your application status.</p>
        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          Close
        </button>
      </div>
    </div>
  )
}

const Form = () => {
  const [formData, setFormData] = useState({
    ticketNo: '',
    date: new Date().toISOString().split('T')[0],
    natureOfRequest: [],
    sourceSystem: [],
    ulbCode: '',
    userId: '',
    employeeName: '',
    employeeCode: '',
    designation: '',
    mobile: '',
    email: '',
    section: '',
    tcodeList: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditable, setIsEditable] = useState(true)

  const natureOfRequestOptions = [
    'New User ID Creation',
    'Change in Authorizations',
    'Transfer',
    'Additional Charge',
    'Change of ownership',
    'Password Reset'
  ]

  const sourceSystemOptions = [
    'SAP ECC',
    'SAP TRM',
    'SAP PORTAL',
    'SAP CRM'
  ]

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
      navigate('/login')
      return
    }

    // Enable auto-fill for Employee, ITAssistant, ITOfficer, ITHead
    if (["Employee", "ITAssistant", "ITOfficer", "ITHead"].includes(role)) {
      setLoading(true)
      axios.get(endpoints.auth.me, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        const user = res.data
        setFormData(prev => ({
          ...prev,
          userId: user.username || '',
          employeeName: user.employeeName ?? '',
          employeeCode: user.employeeCode ?? '',
          designation: user.designation ?? '',
          mobile: user.mobile ?? '',
          email: user.email ?? '',
          ulbCode: user.ulbCode ?? '',
          section: user.section ?? ''
        }))
        // Use the user object to check for missing fields
        const requiredFields = [
          'userId',
          'employeeName', 
          'employeeCode', 
          'designation', 
          'mobile', 
          'email', 
          'ulbCode', 
          'section'
        ]
        const missingFields = requiredFields.filter(field => 
          !(field === 'userId' ? user.username : user[field]) || (field === 'userId' ? user.username : user[field]).trim() === ''
        )
        setIsEditable(missingFields.length > 0)
      })
      .catch(() => setIsEditable(true))
      .finally(() => setLoading(false))
    } else {
      setIsEditable(true)
    }
  }, [navigate])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required'
    if (!formData.employeeCode.trim()) newErrors.employeeCode = 'Employee code is required'
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required'
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.ulbCode.trim()) newErrors.ulbCode = 'ULB Code is required'
    if (formData.natureOfRequest.length === 0) newErrors.natureOfRequest = 'Select at least one nature of request'
    if (formData.sourceSystem.length === 0) newErrors.sourceSystem = 'Select at least one source system'
    if (!formData.userId.trim()) newErrors.userId = 'User ID is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.')
      return
    }
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        endpoints.applications.create,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setSubmissionSuccess(response.data.ticketNo)
      toast.success('Application submitted successfully!')
      setFormData({
        ticketNo: '',
        date: new Date().toISOString().split('T')[0],
        natureOfRequest: [],
        sourceSystem: [],
        ulbCode: '',
        userId: '',
        employeeName: '',
        employeeCode: '',
        designation: '',
        mobile: '',
        email: '',
        section: '',
        tcodeList: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error submitting form. Please try again.')
      setErrors({ submit: 'Error submitting form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setSubmissionSuccess(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600 dark:text-gray-300">Loading your details...</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white tracking-tight">
        User ID Creation / Authorization Change Form
        <br />
        <span className="text-xl font-normal text-gray-600 dark:text-gray-400">
          फॉर्म ऑफ़ नई यूज़र आईडी क्रिएशन / ऑथोराइजेशन चेंज के लिए
        </span>
      </h1>

      {errors.submit && (
        null
      )}

      <form onSubmit={handleSubmit} className="space-y-10 backdrop-blur-lg bg-white/60 dark:bg-gray-900/70 border border-white/40 dark:border-gray-700 p-8 rounded-2xl shadow-xl">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">Nature of Request</h2>
          <div className="grid grid-cols-2 gap-4">
            {natureOfRequestOptions.map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setFormData(prev => ({
                      ...prev,
                      natureOfRequest: checked 
                        ? [...prev.natureOfRequest, item]
                        : prev.natureOfRequest.filter(x => x !== item)
                    }))
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 accent-blue-600 dark:accent-blue-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
                />
                <span className="dark:text-gray-300">{item}</span>
              </label>
            ))}
          </div>
          {errors.natureOfRequest && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.natureOfRequest}</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold dark:text-white">Source System</h2>
          <div className="grid grid-cols-2 gap-4">
            {sourceSystemOptions.map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={item}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setFormData(prev => ({
                      ...prev,
                      sourceSystem: checked 
                        ? [...prev.sourceSystem, item]
                        : prev.sourceSystem.filter(x => x !== item)
                    }))
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 accent-blue-600 dark:accent-blue-400 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
                />
                <span className="dark:text-gray-300">{item}</span>
              </label>
            ))}
          </div>
          {errors.sourceSystem && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.sourceSystem}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: 'ULB Code and Name', key: 'ulbCode' },
            { label: 'User ID', key: 'userId' },
            { label: 'Employee Name', key: 'employeeName' },
            { label: 'Employee Code', key: 'employeeCode' },
            { label: 'Designation', key: 'designation' },
            { label: 'Mobile Number', key: 'mobile' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Section', key: 'section' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                className={`form-input rounded-full bg-white/80 dark:bg-gray-800/70 border-none shadow focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition text-gray-800 dark:text-white backdrop-blur-md ${!isEditable ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={formData[field.key]}
                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                readOnly={!isEditable}
              />
              {errors[field.key] && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`rounded-full px-6 py-3 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      {submissionSuccess && (
        <SuccessModal
          ticketNo={submissionSuccess}
          onClose={handleCloseSuccessModal}
        />
      )}
    </div>
  )
}

export default Form