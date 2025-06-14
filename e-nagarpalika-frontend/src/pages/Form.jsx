import React, { useState } from 'react'
import axios from 'axios'

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post('http://localhost:5000/api/applications', formData)
      setSubmissionSuccess(response.data.ticketNo)
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
      setErrors({ submit: 'Error submitting form. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setSubmissionSuccess(null)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white">
        User ID Creation / Authorization Change Form
        <br />
        <span className="text-xl font-normal text-gray-600 dark:text-gray-400">
          फॉर्म ऑफ़ नई यूज़र आईडी क्रिएशन / ऑथोराइजेशन चेंज के लिए
        </span>
      </h1>

      {errors.submit && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
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
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                />
                <span className="dark:text-gray-300">{item}</span>
              </label>
            ))}
          </div>
          {errors.sourceSystem && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.sourceSystem}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'ULB Code and Name', key: 'ulbCode' },
            { label: 'User ID', key: 'userId' },
            { label: 'Employee Name', key: 'employeeName' },
            { label: 'Employee Code', key: 'employeeCode' },
            { label: 'Designation', key: 'designation' },
            { label: 'Mobile Number', key: 'mobile' },
            { label: 'Email', key: 'email' },
            { label: 'Section', key: 'section' }
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                {field.label}
              </label>
              <input
                type={field.key === 'email' ? 'email' : 'text'}
                className="form-input"
                value={formData[field.key]}
                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
              />
              {errors[field.key] && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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