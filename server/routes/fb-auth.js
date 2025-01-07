const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken'); // Import JWT library
const User = require('../models/user');

// POST: Facebook Login
router.post('/facebook-login', async (req, res) => {
  console.log('Received Facebook login request:', req.body);

  try {
    const { accessToken, userID, email, name, userType } = req.body;

    // Validate required fields
    if (!accessToken || !userID || !email || !name || !userType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify Facebook token
    const verifyTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const tokenResponse = await fetch(verifyTokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.data || !tokenData.data.is_valid) {
      return res.status(400).json({ error: 'Invalid Facebook token' });
    }

    // Get additional user data from Facebook
    const fbUserResponse = await fetch(`https://graph.facebook.com/v19.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
    const fbUserData = await fbUserResponse.json();

    // Check if user exists
    let user = await User.findOne({ userId: userID });
    let isNewUser = false;

    if (!user) {
      // Create new user
      user = new User({
        userId: userID,
        email,
        name,
        userType,
        profilePhotoUrl: fbUserData.picture?.data?.url,
        profileCompleted: false,
        socialLinks: { facebook: `https://facebook.com/${userID}` },
      });
      await user.save();
      isNewUser = true;
    } else {
      // Update existing user if necessary
      if (!user.profilePhotoUrl) {
        user.profilePhotoUrl = fbUserData.picture?.data?.url;
        user.socialLinks.facebook = `https://facebook.com/${userID}`;
        await user.save();
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, email: user.email, userType: user.userType },
      process.env.JWT_SECRET, // Secure secret key
      { expiresIn: '1h' } // Token expiration
    );

    // Determine redirect path
    const redirectTo = isNewUser || !user.profileCompleted
      ? userType === 'advisor' ? `/advisor-update-profile/${userID}` : `/seeker-update-profile/${userID}`
      : user.userType === 'advisor' ? `/advisor-profile/${user.userId}` : `/seeker-profile/${user.userId}`;

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profileCompleted: user.profileCompleted,
        profilePhotoUrl: user.profilePhotoUrl,
      },
      token,
      redirectTo,
      isNewUser,
    });
  } catch (error) {
    console.error('Facebook authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
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

// GET: Fetch Facebook Current User (Protected Route)
router.get('/facebook-current-user', authenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.query;

    const user = await User.findOne(userId ? { userId } : { email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching Facebook user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// GET: Fetch Facebook Current Advisors (Protected Route)
router.get('/facebook-advisors', authenticateToken, async (req, res) => {
  try {
    const { userType } = req.query;

    // Validate userType (ensure it's 'advisor')
    if (userType !== 'advisor') {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    // Fetch advisors who logged in via Facebook
    const advisors = await User.find({ userType: 'advisor', socialLinks: { $exists: true, $ne: null } });

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ error: 'No advisors found' });
    }

    res.json({ advisors });
  } catch (error) {
    console.error('Error fetching Facebook advisors:', error);
    res.status(500).json({ error: 'Failed to fetch advisors' });
  }
});

/*/ GET: Fetch Facebook Advisors (with rating) - Protected Route
router.get('/facebook-advisors', authenticateToken, async (req, res) => {
  try {
    const { email, userId } = req.query;

    // Fetch advisors by userId or email, and make sure they are 'advisor' and have completed profile
    let advisors = await User.find({
      $or: [{ userId }, { email }],
      userType: 'advisor',
      profileCompleted: true, // Ensure profile is completed
      socialLinks: { facebook: { $exists: true } }, // Ensure they have Facebook link
    });

    if (!advisors || advisors.length === 0) {
      return res.status(404).json({ error: 'No advisors found' });
    }

    // Map data to include rating and other necessary fields
    const responseData = advisors.map(advisor => ({
      id: advisor._id,
      homeRating: advisor.rating || 0, // Include rating here, default to 0 if not available
      title: advisor.name || 'Advisor', // Title fallback
      subtitle: advisor.qualifications || 'Psychic Reading, Astrology, Tarot Readings',
      personalDes: advisor.description || 'Lorem Ipsum is simply dummy text...',
      content: advisor.displayName || 'Unknown User',
      timeText: `${advisor.perMinuteRate} for 5 minutes`,
      imgUrl: advisor.profilePhotoUrl || 'https://unsplash.it/200/200', // Default image URL
    }));

    res.status(200).json({ advisors: responseData });
  } catch (error) {
    console.error('Error fetching Facebook advisors:', error);
    res.status(500).json({ error: 'Failed to fetch Facebook advisor data' });
  }
});*/


module.exports = router;
