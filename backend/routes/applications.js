import express from 'express';
import Application from '../models/Application.js';
import { sendEmail } from '../utils/email.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create application
router.post('/', async (req, res) => {
  try {
    const ticketNo = 'TICKET-' + Date.now();
    const application = new Application({
      ...req.body,
      ticketNo,
      status: 'pending',
      currentLevel: 'CMO'
    });

    await application.save();
    
    // Send email notification
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
    const { role } = req.user;

    let query = {};
    
    if (status === 'pending') {
      // Show only pending applications for the current role level
      query = { 
        currentLevel: role,
        status: 'pending'
      };
    } else if (status === 'approved') {
      // For approved applications, show those that have been approved by the current role
      query = {
        $or: [
          { status: 'approved' },
          {
            status: 'pending',
            currentLevel: { $ne: role },
            $or: [
              { previousLevels: role },
              { 
                currentLevel: {
                  $in: role === 'CMO' ? ['NodalOfficer', 'Commissioner'] :
                         role === 'NodalOfficer' ? ['Commissioner'] : []
                }
              }
            ]
          }
        ]
      };
    } else if (status === 'rejected') {
      // Show rejected applications
      query = { status: 'rejected' };
    }

    const applications = await Application.find(query)
      .sort({ createdAt: -1 });

    // Add flow status information to each application
    const enrichedApplications = applications.map(app => {
      const flowStatus = {
        CMO: 'pending',
        NodalOfficer: 'pending',
        Commissioner: 'pending'
      };

      if (app.status === 'rejected') {
        // If rejected, mark all subsequent levels as rejected
        const levels = ['CMO', 'NodalOfficer', 'Commissioner'];
        const currentIndex = levels.indexOf(app.currentLevel);
        levels.forEach((level, index) => {
          flowStatus[level] = index < currentIndex ? 'approved' : 
                            index === currentIndex ? 'rejected' : 'pending';
        });
      } else {
        // For pending/approved applications
        const levels = ['CMO', 'NodalOfficer', 'Commissioner'];
        const currentIndex = levels.indexOf(app.currentLevel);
        levels.forEach((level, index) => {
          if (index < currentIndex) {
            flowStatus[level] = 'approved';
          } else if (index === currentIndex) {
            flowStatus[level] = app.status === 'approved' ? 'approved' : 'pending';
          }
          // Levels after current remain pending
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

// Update application status
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body;
    const { role } = req.user;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.currentLevel !== role) {
      return res.status(403).json({ 
        message: 'You are not authorized to perform this action at the current level' 
      });
    }

    let updateData = {
      $set: {},
      $push: { previousLevels: role }
    };

    if (action === 'approve') {
      switch (role) {
        case 'CMO':
          updateData.$set.currentLevel = 'NodalOfficer';
          break;
        case 'NodalOfficer':
          updateData.$set.currentLevel = 'Commissioner';
          break;
        case 'Commissioner':
          updateData.$set.currentLevel = 'Completed';
          updateData.$set.status = 'approved';
          break;
        default:
          return res.status(400).json({ message: 'Invalid role' });
      }
    } else if (action === 'reject') {
      updateData.$set = {
        status: 'rejected',
        currentLevel: 'Completed',
        remarks: remarks || 'Application rejected'
      };
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Send email notification
    await sendEmail(
      application.email,
      'Application Status Updated',
      `Your application (${application.ticketNo}) has been ${action}ed by ${role}. ${remarks ? `Remarks: ${remarks}` : ''}`
    );

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ 
      message: 'Server error updating application', 
      error: error.message 
    });
  }
});

export default router;