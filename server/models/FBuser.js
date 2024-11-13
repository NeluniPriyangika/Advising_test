const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: {
    type: String,
    sparse: true,
    unique: true
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
  displayName: String,
  qualifications: String,
  certifications: String,
  description: String,
  perMinuteRate: {
    amount: {
      type: Number,
      default: 1,
    },
    currency: {
      type: String,
      default: 'USD',
    }
  },
  profilePhotoUrl: String,
  timeZone: [String],
  availableDays: [String],
  availableHoursstart: String,
  availableHoursend: String,
  languages: String,
  phoneNumber: String,
  profilePhoto: String,
  socialLinks: {
    facebook: String,
    linkedin: String,
    twitter: String,
  },
  birthday: Date,
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const FBUser = mongoose.model('FBUser', userSchema);

module.exports = FBUser;