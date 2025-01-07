const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Remove authentication for public advisor listings
router.get('/advisors', async (req, res) => {
  try {
    // Fetch all completed advisor profiles
    const advisors = await User.find({
      userType: 'advisor',
      profileCompleted: true
    }).select('fullName qualifications description perMinuteRate profilePhotoUrl');

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ message: 'No advisors found' });
    }

    // Format the response data
    const responseData = advisors.map(advisor => ({
      id: advisor._id,
      title: advisor.fullName || 'Advisor',
      subtitle: advisor.qualifications || 'Psychic Reading, Astrology, Tarot Readings',
      personalDes: advisor.description || 'No description available',
      timeText: `$${advisor.perMinuteRate || 0} per minute`,
      imgUrl: advisor.profilePhotoUrl || '/default-avatar.png'
    }));

    res.status(200).json({ advisors: responseData });
  } catch (error) {
    console.error('Error fetching advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
});

module.exports = router;