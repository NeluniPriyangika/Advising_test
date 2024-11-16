const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const User = require('../models/user');

router.post('/facebook-login', async (req, res) => {
  console.log('Received Facebook login request:', req.body);

  try {
    const { accessToken, userID, email, name, userType } = req.body;

    // Validate required fields
    if (!accessToken || !userID || !email || !name || !userType) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Verify Facebook token
    const verifyTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;
    const tokenResponse = await fetch(verifyTokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenData.data || !tokenData.data.is_valid) {
      return res.status(400).json({
        error: 'Invalid Facebook token'
      });
    }

    // Get additional user data from Facebook
    const fbUserResponse = await fetch(`https://graph.facebook.com/v19.0/${userID}?fields=id,name,email,picture&access_token=${accessToken}`);
    const fbUserData = await fbUserResponse.json();

    // Check if user exists with this Facebook ID
    let user = await User.findOne({ userId: userID });

    // If user exists, check if they're trying to sign up with a different userType
    if (user && user.userType !== userType) {
      return res.status(400).json({
        error: `This Facebook account is already registered as a ${user.userType}. Please use a different Facebook account to register as a ${userType}.`
      });
    }

    // If no user found with Facebook ID, check email
    if (!user) {
      user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({
          error: `This email is already registered as a ${user.userType}. Please use a different email address to register as a ${userType}.`
        });
      }
    }

    let isNewUser = false;

    if (!user) {
      // Create new user with Facebook data
      const userData = {
        userId: userID,
        email,
        name,
        userType,
        profilePhotoUrl: fbUserData.picture?.data?.url,
        profileCompleted: false,
        socialLinks: {
          facebook: `https://facebook.com/${userID}`
        }
      };

      try {
        user = new User(userData);
        await user.save();
        console.log('New user created:', user);
        isNewUser = true;
      } catch (saveError) {
        console.error('Error saving new user:', saveError);
        return res.status(500).json({
          error: 'Failed to create user account'
        });
      }
    } else {
      // Update existing user's Facebook data if needed
	  // Update existing user's Facebook data
    if (!user.userId || !user.profilePhotoUrl) {
      user.userId = userID;
      user.profilePhotoUrl = fbUserData.picture?.data?.url;
      user.socialLinks = {
        ...user.socialLinks,
        facebook: `https://facebook.com/${userID}`
      };

        try {
          await user.save();
          console.log('Existing user updated:', user);
        } catch (updateError) {
          console.error('Error updating user:', updateError);
          return res.status(500).json({
            error: 'Failed to update user account'
          });
        }
      }
    }

    // Determine redirect path
    const redirectTo = isNewUser || !user.profileCompleted
      ? `/${userType}-update-profile`
      : `/${userType}-profile`;

    // Send response
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        profileCompleted: user.profileCompleted,
        profilePhotoUrl: user.profilePhotoUrl
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

    return res.status(500).json({
      error: error.message || 'Authentication failed'
    });
  }
});

// Add this new route to your existing fb-auth.js
router.get('/facebook-current-user', async (req, res) => {
  try {
    const { email, userId } = req.query;
    
    let user = await User.findOne(userId ? { userId } : { email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error fetching Facebook user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;