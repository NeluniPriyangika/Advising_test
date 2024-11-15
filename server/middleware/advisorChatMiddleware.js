const { AdvisorMessage, AdvisorChatSession } = require('../models/advisorChatModel');

const advisorChatMiddleware = async (req, res, next) => {
  try {
    const { advisorSessionId } = req.body;
    
    if (!advisorSessionId) {
      return res.status(401).json({ error: 'Chat session ID required' });
    }

    const chatSession = await AdvisorChatSession.findById(advisorSessionId);

    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    if (chatSession.status !== 'active') {
      return res.status(403).json({ error: 'Chat session is no longer active' });
    }

    // Add chat session info to request
    req.advisorSession = chatSession;

    next();
  } catch (err) {
    res.status(401).json({ error: 'Chat session verification failed' });
  }
};

module.exports = advisorChatMiddleware;