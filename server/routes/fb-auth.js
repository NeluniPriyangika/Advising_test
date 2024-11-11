const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../models/user');

router.post('/facebook-login', async (req, res) => {
  console.log('Received Facebook login request:', req.body); // Debug log

  
  try {
    // Validate required fields
    const { accessToken, userID, email, name, userType } = req.body;
    
    if (!accessToken || !userID || !email || !name || !userType) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Verify the access token with Facebook
    const verifyTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const tokenResponse = await fetch(verifyTokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.data || !tokenData.data.is_valid) {
      return res.status(400).json({
        error: 'Invalid Facebook token'
      });
    }

    // Check if user exists
    let user = await User.findOne({
      $or: [
        { facebookId: userID },
        { email: email }
      ]
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      try {
        user = new User({
          facebookId: userID,
          email,
          name,
          userType,
          profileCompleted: false
        });
        await user.save();
        isNewUser = true;
      } catch (saveError) {
        console.error('Error saving new user:', saveError);
        return res.status(500).json({
          error: 'Failed to create user account'
        });
      }
    } else {
      // Update existing user's Facebook ID if they didn't have one
      if (!user.facebookId) {
        user.facebookId = userID;
        try {
          await user.save();
        } catch (updateError) {
          console.error('Error updating user:', updateError);
          return res.status(500).json({
            error: 'Failed to update user account'
          });
        }
      }
    }

    // Determine redirect path
    let redirectTo;
    if (isNewUser || !user.profileCompleted) {
      redirectTo = userType === 'advisor' ? '/advisor-update-profile' : '/seeker-update-profile';
    } else {
      redirectTo = user.userType === 'advisor' ? '/advisor-home' : '/seeker-home';
    }

    // Send successful response with properly formatted JSON
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profileCompleted: user.profileCompleted
      },
      redirectTo,
      isNewUser
    });

  } catch (error) {
    console.error('Facebook authentication error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Send error response in JSON format
    return res.status(500).json({
      error: error.message || 'Authentication failed'
    });
  }
});

module.exports = router;