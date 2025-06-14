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
  userId: String,
  employeeName: String,
  employeeCode: String,
  designation: String,
  mobile: String,
  email: String,
  section: String,
  tcodeList: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  currentLevel: {
    type: String,
    enum: ['CMO', 'NodalOfficer', 'Commissioner', 'Completed'],
    default: 'CMO'
  },
  previousLevels: [{
    type: String,
    enum: ['CMO', 'NodalOfficer', 'Commissioner']
  }],
  remarks: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Application', applicationSchema);