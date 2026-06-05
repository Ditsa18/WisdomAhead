import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleId: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['locked', 'unlocked', 'completed'],
    default: 'locked'
  },
  deliverableAnswers: {
    type: Map,
    of: String,
    default: {}
  },
  completedAt: {
    type: Date
  }
});

// A user can only have one progress record per module
progressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
