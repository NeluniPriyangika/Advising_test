const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('../models/user');

// Initialize Google OAuth2 Client
const client = new OAuth2Client(process.env.CLIENT_ID);

// POST: Google Login
router.post('/google-login', async (req, res) => {
  const { credential, userType } = req.body;

  try {
    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID,
    });

    const { sub, email, name } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ userId: sub });
    let isNewUser = false;

    if (!user) {
      // If user is new, create a new user in the database
      user = new User({
        userId: sub,
        email,
        name,
        userType,
        profileCompleted: false,
      });
      await user.save();
      isNewUser = true;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, userType: user.userType },
      process.env.JWT_SECRET, // Use a secure secret key
      { expiresIn: '1h' } // Token expiration time
    );

    // Determine redirect path
    let redirectTo;
    if (isNewUser || !user.profileCompleted) {
      redirectTo = userType === 'advisor' ? `/advisor-update-profile/${sub}` : `/seeker-update-profile/${sub}`;
    } else {
      redirectTo = user.userType === 'advisor' ? `/advisor-profile/${user.userId}` : `/seeker-profile/${user.userId}`;
    }

    res.json({ user, token, redirectTo, isNewUser });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(400).json({ error: 'Authentication failed' });
  }
});

// Middleware: Verify JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user; // Attach decoded user info to request
    next();
  });
};

// GET: Fetch Google Current User (Protected Route)
router.get('/google-current-user', authenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.query;

    // Fetch user by userId or email
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

/*/ GET: Fetch Google Advisors (with rating) - Protected Route
router.get('/google-advisors', authenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.query;

    // Fetch advisors by userId or email, and make sure they are 'advisor' and have completed profile
    let advisors = await User.find({
      $or: [{ userId }, { email }],
      userType: 'advisor',
      profileCompleted: true, // Ensure profile is completed
    });

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ error: 'No advisors found' });
    }

    // Map data to include rating and other necessary fields
    const responseData = advisors.map(advisor => ({
      id: advisor._id,
      homeRating: advisor.rating, // Include rating here
      title: advisor.fullName || 'Advisor', // Title fallback
      subtitle: advisor.qualifications || 'Psychic Reading, Astrology, Tarot Readings',
      personalDes: advisor.description || 'Lorem Ipsum is simply dummy text...',
      content: advisor.displayName || 'Unknown User',
      timeText: `${advisor.perMinuteRate} for 5 minutes`,
      imgUrl: advisor.profilePhotoUrl || 'https://unsplash.it/200/200', // Default image URL
    }));

    res.status(200).json({ advisors: responseData });
  } catch (error) {
    console.error('Error fetching Google advisors:', error);
    res.status(500).json({ error: 'Failed to fetch Google advisor data' });
  }
});*/

module.exports = router;
