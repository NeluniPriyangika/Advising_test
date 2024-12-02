const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/advisor-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const advisor = await User.findOne({ userId: userId }).lean();

    if (!advisor) {
      return res.status(404).json({ error: 'Advisor not found' });
    }

    if (advisor.userType !== 'advisor') {
      return res.status(403).json({ error: 'Requested user is not an advisor' });
    }

    // Match the response fields with your user model
    res.json({
      userId: advisor.userId,
      name: advisor.fullName || advisor.name,
      email: advisor.email,
      experience: advisor.qualifications,
      bio: advisor.description,
      certifications: advisor.certifications,
      availableDays: advisor.availableDays,
      availableTimeStart: advisor.availableHoursstart,
      availableTimeEnd: advisor.availableHoursend,
      ratePerMinute: advisor.perMinuteRate?.amount || 0,
      languages: advisor.languages,
      profilePhotoUrl: advisor.profilePhotoUrl,
      profileCompleted: advisor.profileCompleted
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Failed to fetch advisor profile',
      details: error.message
    });
  }
});

module.exports = router;