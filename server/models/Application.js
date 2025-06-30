import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  ticketNo: {
    type: String,
    required: true,
    unique: true
  },
  natureOfRequest: [{
    type: String
  }],
  sourceSystem: [{
    type: String
  }],
  ulbCode: String,
 
  employeeName: String,
  employeeCode: String,
  designation: String,
  mobile: String,
  email: String,
  section: String,
  tcodeList: String,
  userId: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  currentLevel: {
    type: String,
    enum: ['ITAssistant', 'ITOfficer', 'ITHead', 'Completed'],
    default: 'ITAssistant'
  },
  previousLevels: [{
    type: String,
    enum: ['ITAssistant', 'ITOfficer', 'ITHead']
  }],
  ITAssistantApproved: {
    type: Boolean,
    default: false
  },
  ITAssistantApprovedBy: String,
  ITOfficerApproved: {
    type: Boolean,
    default: false
  },
  ITOfficerApprovedBy: String,
  ITHeadApproved: {
    type: Boolean,
    default: false
  },
  ITHeadApprovedBy: String,
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Application', applicationSchema);