import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const feedbackReportSchema = new mongoose.Schema({
  scores: {
    clarity: { type: Number, default: 0 },
    marketUnderstanding: { type: Number, default: 0 },
    valueProposition: { type: Number, default: 0 },
    storytelling: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  },
  keyStrength: { type: String, default: '' },
  criticalGap: { type: String, default: '' },
  actionItems: [{ type: String }] // 3 bullet points
});

const pitchSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [messageSchema],
  feedbackReport: {
    type: feedbackReportSchema,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PitchSession = mongoose.model('PitchSession', pitchSessionSchema);
export default PitchSession;
