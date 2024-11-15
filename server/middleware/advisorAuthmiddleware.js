const User = require('../models/user');
const FBUser = require('../models/FBuser');

const advisorAuthMiddleware = async (req, res, next) => {
  try {
    // Check for various ID types
    const { googleId, facebookId, userId, email } = req.body;

    let user;

    // Priority order: Direct ID > Social IDs > Email
    if (userId) {
      user = await User.findById(userId) || await FBUser.findById(userId);
    } else if (googleId) {
      user = await User.findOne({ googleId });
    } else if (facebookId) {
      user = await FBUser.findOne({ facebookId });
    } else if (email) {
      user = await User.findOne({ email }) || await FBUser.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.userType !== 'advisor') {
      return res.status(403).json({ error: 'Only advisors can access chat features' });
    }

    if (!user.profileCompleted) {
      return res.status(403).json({ error: 'Please complete your advisor profile first' });
    }

    // Enhanced advisor info
    req.advisor = {
      id: user._id,
      googleId: user.googleId,
      facebookId: user.facebookId,
      email: user.email,
      name: user.fullName || user.displayName,
      perMinuteRate: user.perMinuteRate,
      timeZone: user.timeZone,
      authType: user.googleId ? 'google' : 'facebook',
      userType: user.userType
    };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = advisorAuthMiddleware;