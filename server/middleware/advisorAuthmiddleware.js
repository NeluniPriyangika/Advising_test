const authHandlers = require('./authHandlers');

const advisorAuthMiddleware = async (req, res, next) => {
  try {
    // Extract all possible identifiers from request
    const { userId, email } = req.body;

    // No identifiers provided
    if (!userId &&  !email) {
      return res.status(401).json({ error: 'Authentication credentials required' });
    }

    const currentUser = await authHandlers.getCurrentUser({
      userId,
      email
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { user } = currentUser;

    if (user.userType !== 'advisor') {
      return res.status(403).json({ error: 'Only advisors can access chat features' });
    }

    if (!user.profileCompleted) {
      return res.status(403).json({ error: 'Please complete your advisor profile first' });
    }

    // Add user info to request
    req.advisor = {
      id: user._id,
      email: user.email,
      name: user.fullName || user.displayName,
      perMinuteRate: user.perMinuteRate,
      timeZone: user.timeZone,
      authType: currentUser.authType,
      userType: user.userType,
      // Add IDs based on auth type
      ...(currentUser.authType === 'google' ? { userId: user.userId } : {}),
      ...(currentUser.authType === 'facebook' ? { facebookId: user.facebookId } : {})
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = advisorAuthMiddleware;