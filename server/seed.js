import mongoose from 'mongoose';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import Module from './models/Module.js';
import { seedModules } from './seed/seedData.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mindlaunch';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB(MONGODB_URI);

    console.log('Clearing existing modules...');
    await Module.deleteMany({});
    console.log('Existing modules cleared.');

    console.log(`Inserting ${seedModules.length} curriculum modules...`);
    const inserted = await Module.insertMany(seedModules);
    console.log(`Seeded ${inserted.length} modules successfully!`);

    await mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
