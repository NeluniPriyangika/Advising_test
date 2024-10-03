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

    let user = await User.findOne({ googleId: sub });
    let isNewUser = false;

    if (!user) {
      // New user
      user = new User({
        googleId: sub,
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
      redirectTo = userType === 'advisor' ? '/advisor-update-profile' : '/seeker-update-profile';
    } else {
      // Existing user with completed profile
      redirectTo = user.userType === 'advisor' ? '/advisor-home' : '/seeker-home';
    }

    res.json({ user, redirectTo, isNewUser });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

module.exports = router;