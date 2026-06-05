import mongoose from 'mongoose';

const deliverableSchema = new mongoose.Schema({
  fieldKey: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  }
});

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'header', 'bullet'],
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const moduleSchema = new mongoose.Schema({
  moduleId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  track: {
    type: Number,
    required: true // 1 to 5
  },
  trackName: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    default: 0 // Price in INR
  },
  region: {
    type: String,
    default: 'India'
  },
  content: {
    videoUrl: {
      type: String,
      default: '' // Placeholder video URL
    },
    sections: [sectionSchema]
  },
  deliverableSchema: [deliverableSchema]
});

const Module = mongoose.model('Module', moduleSchema);
export default Module;
