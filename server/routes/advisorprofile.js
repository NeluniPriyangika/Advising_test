const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');



// Backend: Create a new route in profileupdate.js
router.get('/advisor-profile/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      if (!userId || userId === 'undefined') {
        return res.status(400).json({ error: 'Valid user ID required' });
      }
  
      const advisor = await User.findById(userId);
      if (!advisor) {
        return res.status(404).json({ error: 'Advisor not found' });
      }
  
      res.json(advisor);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = router;