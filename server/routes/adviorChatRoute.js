const express = require('express');
const router = express.Router();
const { AdvisorMessage, AdvisorChatSession } = require('../models/advisorChatModel');
const User = require('../models/user');

// Create new chat session
router.post('/advisor-session/:userId', async (req, res) => {
  try {
    const { advisorId, seekerId } = req.body;

    if (!advisorId || !seekerId) {
      return res.status(400).json({ error: 'Both advisorId and seekerId are required' });
    }

    // Verify both users exist and advisor has correct type
    const advisor = await User.findOne({ userId: advisorId });
    const seeker = await User.findOne({ userId: seekerId });

    if (!advisor || !seeker) {
      return res.status(404).json({ error: 'Advisor or seeker not found' });
    }

    if (advisor.userType !== 'advisor') {
      return res.status(403).json({ error: 'Specified advisor is not registered as an advisor' });
    }

    const advisorSession = new AdvisorChatSession({
      advisor: advisor._id,
      seeker: seeker._id,
      startTime: new Date(),
      status: 'active'
    });

    await advisorSession.save();
    res.status(201).json(advisorSession);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      details: error.message
    });
  }
});

// Send message
router.post('/advisor-message/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId, text, position } = req.body;

    if (!sessionId || !text || !position) {
      return res.status(400).json({ error: 'SessionId, text and position are required' });
    }

    // Find the active session
    const session = await AdvisorChatSession.findOne({
      _id: sessionId,
      status: 'active'
    }).populate('advisor seeker');

    if (!session) {
      return res.status(404).json({ error: 'Active chat session not found' });
    }

    // Determine sender and receiver based on userId and position
    const sender = userId;
    const receiver = position === 'right' ? session.seeker.userId : session.advisor.userId;

    const advisorMessage = new AdvisorMessage({
      sender: sender,
      receiver: receiver,
      text: text,
      position: position,
      type: 'text',
      timestamp: new Date()
    });

    session.messages.push(advisorMessage);
    await session.save();

    // Socket.IO emission if available
    if (req.app.get('io')) {
      req.app.get('io').to(session._id.toString()).emit('message', advisorMessage);
    }

    res.status(201).json(advisorMessage);
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get chat history
router.get('/advisor-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const advisorSessions = await AdvisorChatSession.find({
      $or: [
        { advisor: user._id },
        { seeker: user._id }
      ]
    }).populate('advisor seeker messages');

    res.json(advisorSessions);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error.message
    });
  }
});

// End chat session
router.put('/advisor-session/:userId/:sessionId/end', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!sessionId || sessionId === 'undefined') {
      return res.status(400).json({ error: 'Valid session ID required' });
    }

    const session = await AdvisorChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Verify the user is part of this session
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (session.advisor.toString() !== user._id.toString() && 
        session.seeker.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'User not authorized to end this session' });
    }

    session.endTime = new Date();
    session.duration = (session.endTime - session.startTime) / 1000;
    session.status = 'completed';
    
    await session.save();
    res.json(session);
  } catch (error) {
    console.error('Session end error:', error);
    res.status(500).json({
      error: 'Failed to end chat session',
      details: error.message
    });
  }
});

module.exports = router;