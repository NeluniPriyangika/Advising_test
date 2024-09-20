const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');

const client = new OAuth2Client(process.env.client_id);

router.post('/google-login', async (req, res) => {
  const { credential, userType } = req.body;  // Changed from token to credential

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,  // Use credential instead of token
      audience: process.env.client_id
    });

    const { sub, email, name } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({
        googleId: sub,
        email,
        name,
        userType,
      });
      await user.save();
    }

    res.json({ user, redirectTo: userType === 'advisor' ? '/advisor-home' : '/seeker-home' });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

module.exports = router;