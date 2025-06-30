import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token with more user details
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        username: user.username,
        employeeName: user.employeeName,
        employeeCode: user.employeeCode,
        designation: user.designation,
        mobile: user.mobile,
        email: user.email,
        ulbCode: user.ulbCode,
        section: user.section
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send response with comprehensive user details
    res.json({
      success: true,
      token,
      role: user.role,
      username: user.username,
      userDetails: {
        employeeName: user.employeeName,
        employeeCode: user.employeeCode,
        designation: user.designation,
        mobile: user.mobile,
        email: user.email,
        ulbCode: user.ulbCode,
        section: user.section
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    // Use token payload instead of database query
    const user = {
      username: req.user.username,
      employeeName: req.user.employeeName,
      employeeCode: req.user.employeeCode,
      designation: req.user.designation,
      mobile: req.user.mobile,
      email: req.user.email,
      ulbCode: req.user.ulbCode,
      section: req.user.section,
      role: req.user.role
    };

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;