const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['advisor', 'seeker'],
    required: true,
  },
  fullName: String,
  address: String,
  perMinuteRate: {
    amount: Number,
    minutes: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: String,
  profilePhotoUrl: String,
  phoneNumber: String,
  employmentInfo: String,
  profileCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const User = mongoose.model('User', userSchema);

module.exports = User;
