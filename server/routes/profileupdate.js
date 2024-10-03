const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.post('/update-advisor-profile', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { fullName, address, perMinuteRate, description, phoneNumber, email, employmentInfo } = req.body;

    // TODO: Replace this with actual user authentication
    // For now, we'll just use the email to find the user
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.fullName = fullName;
    user.address = address;
    user.perMinuteRate = JSON.parse(perMinuteRate);
    user.description = description;
    user.phoneNumber = phoneNumber;
    user.employmentInfo = employmentInfo;
    user.profileCompleted = true;

    if (req.file) {
      user.profilePhotoUrl = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.json({ success: true, user: user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;