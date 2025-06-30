import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Employee', 'ITAssistant', 'ITOfficer', 'ITHead'],
    required: true
  },
  userId: {
    type: String,
    required: false
  },
  ulbCode: String,
  employeeName: String,
  employeeCode: String,
  designation: String,
  mobile: String,
  email: String,
  section: String
});

export default mongoose.model('User', userSchema);