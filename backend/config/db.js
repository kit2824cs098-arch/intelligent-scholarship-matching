const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scholarnest';
  
  try {
    // Attempt standard connection to MongoDB
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection failed (${err.message}). Initializing In-Memory MongoDB Server...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to MongoMemoryServer at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
