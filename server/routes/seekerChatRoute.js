const express = require('express');
const router = express.Router();
const { SeekerMessage, SeekerChatSession } = require('../models/seekerChatModel');
const User = require('../models/user');

// Create new chat session
router.post('/seeker-session/:userId', async (req, res) => {
  try {
    const { seekerId, advisorId } = req.body;

    if (!seekerId || !advisorId) {
      return res.status(400).json({ error: 'Both seekerId and advisorId are required' });
    }

    // Verify both users exist and seeker has correct type
    const seeker = await User.findOne({ userId: seekerId });
    const advisor = await User.findOne({ userId: advisorId });

    if (!seeker || !advisor) {
      return res.status(404).json({ error: 'Seeker or advisor not found' });
    }

    if (seeker.userType !== 'seeker') {
      return res.status(403).json({ error: 'Specified seeker is not registered as an seeker' });
    }

    const seekerSession = new SeekerChatSession({
      seeker: seeker._id,
      advisor: advisor._id,
      startTime: new Date(),
      status: 'active'
    });

    await seekerSession.save();
    res.status(201).json(seekerSession);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      details: error.message
    });
  }
});

// Send message
router.post('/seeker-message/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId, text, position } = req.body;

    if (!sessionId || !text || !position) {
      return res.status(400).json({ error: 'SessionId, text and position are required' });
    }

    // Find the active session
    const session = await SeekerChatSession.findOne({
      _id: sessionId,
      status: 'active'
    }).populate('seeker advisor');

    if (!session) {
      return res.status(404).json({ error: 'Active chat session not found' });
    }

    // Determine sender and receiver based on userId and position
    const sender = userId;
    const receiver = position === 'right' ? session.advisor.userId : session.seeker.userId;

    const seekerMessage = new SeekerMessage({
      sender: sender,
      receiver: receiver,
      text: text,
      position: position,
      type: 'text',
      timestamp: new Date()
    });

    session.messages.push(seekerMessage);
    await session.save();

    // Socket.IO emission if available
    if (req.app.get('io')) {
      req.app.get('io').to(session._id.toString()).emit('message', seekerMessage);
    }

    res.status(201).json(seekerMessage);
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get chat history
router.get('/seeker-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(400).json({ error: 'Valid user ID required' });
    }

    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const seekerSessions = await SeekerChatSession.find({
      $or: [
        { seeker: user._id },
        { advisor: user._id }
      ]
    }).populate('seeker advisor messages');

    res.json(seekerSessions);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history',
      details: error.message
    });
  }
});

// End chat session
router.put('/seeker-session/:userId/:sessionId/end', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!sessionId || sessionId === 'undefined') {
      return res.status(400).json({ error: 'Valid session ID required' });
    }

    const session = await SeekerChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Verify the user is part of this session
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (session.seeker.toString() !== user._id.toString() && 
        session.advisor.toString() !== user._id.toString()) {
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