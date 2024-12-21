const express = require('express');
const Chat = require('../models/chat');
const router = express.Router();

// Get chat history
router.get('/history', async (req, res) => {
  try {
    const messages = await Chat.find().sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a new message
router.post('/message', async (req, res) => {
  const { user, message } = req.body;
  const newMessage = new Chat({ user, message });

  try {
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' });
  }
});

module.exports = router;