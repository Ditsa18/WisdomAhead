import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  startupIdea: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  timeOnPlatform: {
    type: Number,
    default: 0 // minutes
  }
});

const User = mongoose.model('User', userSchema);
export default User;
