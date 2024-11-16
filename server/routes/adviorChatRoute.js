const express = require('express');
const router = express.Router();
const { AdvisorMessage, AdvisorChatSession } = require('../models/advisorChatModel');
const advisorAuthMiddleware = require('../middleware/advisorAuthmiddleware');
const advisorChatMiddleware = require('../middleware/advisorChatMiddleware');

//Create new chat session
router.post('/advisor-session', advisorAuthMiddleware, async (req, res) => {
  console.log('Received session request:', req.body);
  try {
    const advisorSession = new AdvisorChatSession({
      advisor: req.body.advisorId,
      seeker: req.body.seekerId
    });
    console.log('Created session:', advisorSession);
    await advisorSession.save();
    console.log('Saved session');
    res.status(201).json(advisorSession);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Send message - requires both auth and chat session verification
router.post('/advisor-message', advisorAuthMiddleware, advisorChatMiddleware, async (req, res) => {
  try {
    const { advisorText, advisorPosition } = req.body;
    
    const advisorMessage = new AdvisorMessage({
      sender: req.advisor.id,  // Using advisor ID from middleware
      receiver: advisorPosition === 'right' ? req.advisorSession.seeker : req.advisorSession.advisor,
      text: advisorText,
      position: advisorPosition,
      type: 'text'
    });

    req.advisorSession.messages.push(advisorMessage);
    await req.advisorSession.save();
    
    req.app.get('io').to(req.advisorSession._id).emit('message', advisorMessage);
    res.status(201).json(advisorMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/advisor-history', advisorAuthMiddleware, async (req, res) => {
  try {
    const advisorSessions = await AdvisorChatSession.find({
      $or: [
        { advisor: req.advisor.id },  // Using advisor ID from middleware
        { seeker: req.advisor.id }
      ]
    }).populate('advisor seeker messages');
    res.json(advisorSessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End chat session
router.put('/advisor-session/:advisorSessionId/end', 
  advisorAuthMiddleware, 
  advisorChatMiddleware, 
  async (req, res) => {
    try {
      req.advisorSession.endTime = new Date();
      req.advisorSession.duration = (req.advisorSession.endTime - req.advisorSession.startTime) / 1000;
      req.advisorSession.status = 'completed';
      await req.advisorSession.save();
      
      res.json(req.advisorSession);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

module.exports = router;