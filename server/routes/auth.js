const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');

const client = new OAuth2Client(process.env.CLIENT_ID);

router.post('/google-login', async (req, res) => {
  const { credential, userType } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID
    });

    const { sub, email, name } = ticket.getPayload();

    let user = await User.findOne({ userId: sub });
    let isNewUser = false;

    if (!user) {
      // New user
      user = new User({
        userId: sub,
        email,
        name,
        userType,
        profileCompleted: false
      });
      await user.save();
      isNewUser = true;
    }

    let redirectTo;
    if (isNewUser || !user.profileCompleted) {
      // New user or existing user with incomplete profile
      redirectTo = userType === 'advisor' ? `/advisor-update-profile/${sub}` : `/seeker-update-profile/${sub}`;
    } else {
      // Existing user with completed profile
      redirectTo = user.userType === 'advisor' ? `/advisor-profile/${user.userId}` : `/seeker-profile/${user.userId}`;
    }

    res.json({ user, redirectTo, isNewUser });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

// Add this new route to your existing auth.js
router.get('/google-current-user', async (req, res) => {
  try {
    const { email, userId } = req.query;
    
    let user = await User.findOne(userId ? { userId } : { email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching Google user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;