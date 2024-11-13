const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const FBUser = require('../models/FBuser');

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
    let user = await FBUser.findOne({ facebookId: userID });

    // If user exists, check if they're trying to sign up with a different userType
    if (user && user.userType !== userType) {
      return res.status(400).json({
        error: `This Facebook account is already registered as a ${user.userType}. Please use a different Facebook account to register as a ${userType}.`
      });
    }

    // If no user found with Facebook ID, check email
    if (!user) {
      user = await FBUser.findOne({ email: email });
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
        facebookId: userID,
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
        user = new FBUser(userData);
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
    if (!user.facebookId || !user.profilePhotoUrl) {
      user.facebookId = userID;
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
      : `/${userType}-home`;

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

module.exports = router;