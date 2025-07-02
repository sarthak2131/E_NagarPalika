import express from 'express';
import Application from '../models/Application.js';
import { sendEmail } from '../utils/email.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create application
router.post('/', auth, async (req, res) => {
  try {
    const ticketNo = 'TICKET-' + Date.now();
    const application = new Application({
      ...req.body,
      ticketNo,
      status: 'pending',
      currentLevel: 'ITAssistant',
      previousLevels: [],
      userId: req.user.username,
    });
    await application.save();
    await sendEmail(
      req.body.email,
      'Application Submitted',
      `Your application has been submitted successfully. Your ticket number is: ${ticketNo}`
    );
    res.status(201).json({ ticketNo });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get applications (for officers)
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const { role, username } = req.user;
    let query = {};
    if (['Employee', 'Clerk'].includes(role)) {
      // Employee and Clerk see their own applications
      query = { userId: username };
    } else if (status === 'pending') {
      // Show pending applications for ITAssistant, ITOfficer, ITHead
      if (role === 'ITAssistant') {
        query = { currentLevel: 'ITAssistant', status: 'pending' };
      } else if (role === 'ITOfficer') {
        query = { currentLevel: { $in: ['ITAssistant', 'ITOfficer'] }, status: 'pending' };
      } else if (role === 'ITHead') {
        query = { currentLevel: 'ITHead', status: { $in: ['pending', 'approved'] } };
      }
    } else if (status === 'approved') {
      query = { status: 'approved' };
    } else if (status === 'fully-approved') {
      query = { status: 'approved', currentLevel: 'Completed' };
    } else if (status === 'partially-approved') {
      query = { status: 'approved', currentLevel: { $ne: 'Completed' } };
    } else if (status === 'rejected') {
      query = { status: 'rejected' };
    }
    const applications = await Application.find(query).sort({ createdAt: -1 });
    // Add flow status information to each application
    const enrichedApplications = applications.map(app => {
      const flowStatus = {
        ITAssistant: app.ITAssistantApproved ? 'approved' : 'pending',
        ITOfficer: app.ITOfficerApproved ? 'approved' : 'pending',
        ITHead: app.ITHeadApproved ? 'approved' : 'pending',
      };
      if (app.status === 'rejected') {
        Object.keys(flowStatus).forEach(level => {
          flowStatus[level] = 'rejected';
        });
      }
      return {
        ...app.toObject(),
        flowStatus
      };
    });
    res.json(enrichedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Track application status
router.get('/track', async (req, res) => {
  try {
    const { query } = req.query;
    const application = await Application.findOne({
      $or: [
        { ticketNo: query },
        { email: query }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error tracking application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update application status (approve/reject)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remarks, level } = req.body;
    const { role, username } = req.user;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    // Stepwise approval logic
    let updateData = { $set: {}, $push: { previousLevels: role } };
    if (action === 'approve') {
      if (level === 'ITAssistant') {
        if (application.ITAssistantApproved) {
          return res.status(400).json({ message: 'Already approved as IT Assistant' });
        }
        updateData.$set.ITAssistantApproved = true;
        updateData.$set.ITAssistantApprovedBy = username;
        updateData.$set.currentLevel = 'ITOfficer';
        updateData.$set.status = 'approved';
        updateData.$set.statusMessage = 'Forwarded to ITOfficer';
      } else if (level === 'ITOfficer') {
        if (!application.ITAssistantApproved) {
          return res.status(400).json({ message: 'IT Assistant approval required first' });
        }
        if (application.ITOfficerApproved) {
          return res.status(400).json({ message: 'Already approved as IT Officer' });
        }
        updateData.$set.ITOfficerApproved = true;
        updateData.$set.ITOfficerApprovedBy = username;
        updateData.$set.currentLevel = 'ITHead';
        updateData.$set.status = 'approved';
        updateData.$set.statusMessage = 'Forwarded to ITHead';
      } else if (level === 'ITHead') {
        if (!application.ITAssistantApproved || !application.ITOfficerApproved) {
          return res.status(400).json({ message: 'IT Assistant and IT Officer approval required first' });
        }
        if (application.ITHeadApproved) {
          return res.status(400).json({ message: 'Already approved as IT Head' });
        }
        updateData.$set.ITHeadApproved = true;
        updateData.$set.ITHeadApprovedBy = username;
        updateData.$set.currentLevel = 'Completed';
        updateData.$set.status = 'approved';
        updateData.$set.statusMessage = 'Final Approved by ITHead';
      } else {
        return res.status(400).json({ message: 'Invalid approval level' });
      }
    } else if (action === 'reject') {
      updateData.$set = {
        status: 'rejected',
        currentLevel: 'Completed',
        remarks: remarks || 'Application rejected'
      };
      // Set rejected by field for the level
      if (level === 'ITAssistant') {
        updateData.$set.ITAssistantRejectedBy = username;
      } else if (level === 'ITOfficer') {
        updateData.$set.ITOfficerRejectedBy = username;
      } else if (level === 'ITHead') {
        updateData.$set.ITHeadRejectedBy = username;
      }
    }
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    await sendEmail(
      application.email,
      'Application Status Updated',
      `Your application (${application.ticketNo}) has been ${action}ed by ${role}. ${remarks ? `Remarks: ${remarks}` : ''}`
    );
    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: 'Server error updating application', error: error.message });
  }
});

// Get single application by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    console.error('Error fetching application by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;