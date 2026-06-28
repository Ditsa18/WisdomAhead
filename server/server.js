import express from 'express';
import { connectDB } from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Resolve .env from project root (one level above /server)
const __dirname = fileURLToPath(new URL('.', import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

import authRouter       from './routes/auth.js';
import modulesRouter    from './routes/modules.js';
import pitchCoachRouter from './routes/pitchCoach.js';
import profileRouter    from './routes/profile.js';
import documentsRouter  from './routes/documents.js';
import paymentsRouter   from './routes/payments.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindlaunch';

app.use(cors());

app.use((req, res, next) => {
  if (req.originalUrl === '/api/payments/webhook') return next();
  express.json()(req, res, next);
});

// Route logging — remove after debugging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth',        authRouter);
app.use('/api/modules',     modulesRouter);
app.use('/api/pitch-coach', pitchCoachRouter);
app.use('/api/profile',     profileRouter);
app.use('/api/documents',   documentsRouter);
app.use('/api/payments',    paymentsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'MindLaunch server is running.' });
});

console.log('Connecting to MongoDB...');
connectDB(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`✅ Server started on port ${PORT}`);
      console.log(`   Anthropic key present: ${!!process.env.ANTHROPIC_API_KEY}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(
          `❌ FATAL: Port ${PORT} is already in use.\n` +
          `   Kill it first: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F`
        );
      } else {
        console.error('Server error:', err);
      }
      process.exit(1);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    process.exit(1);
  });