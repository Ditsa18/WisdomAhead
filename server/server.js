import express from 'express';
import { connectDB } from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRouter from './routes/auth.js';
import modulesRouter from './routes/modules.js';
import pitchCoachRouter from './routes/pitchCoach.js';
import profileRouter from './routes/profile.js';
import documentsRouter from './routes/documents.js';
import paymentsRouter from './routes/payments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindlaunch';

// Middlewares
app.use(cors());

// Apply express.json() to all routes EXCEPT the Stripe Webhook which needs raw body parsing
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Mount API Routes
app.use('/api/auth', authRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/pitch-coach', pitchCoachRouter);
app.use('/api/profile', profileRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/payments', paymentsRouter);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MindLaunch server is running smoothly.' });
});

// Database Connection and Server Start
console.log('Connecting to MongoDB...');
connectDB(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const fallbackPort = Number(PORT) + 1;
        console.error(`Port ${PORT} is already in use. Trying fallback port ${fallbackPort}...`);
        app.listen(fallbackPort, () => {
          console.log(`Server is running on fallback port ${fallbackPort}`);
        }).on('error', (fallbackErr) => {
          console.error('Fallback port failed:', fallbackErr);
          process.exit(1);
        });
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
