const mongoose = require('mongoose');

const advisormessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  position: { type: String, enum: ['left', 'right'], required: true },
  type: { type: String, default: 'text' }
});

const advisorchatSessionSchema = new mongoose.Schema({
  advisor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  messages: [advisormessageSchema],
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const AdvisorMessage = mongoose.model('Message', advisormessageSchema);
const AdvisorChatSession = mongoose.model('ChatSession', advisorchatSessionSchema);

module.exports = { AdvisorMessage, AdvisorChatSession };