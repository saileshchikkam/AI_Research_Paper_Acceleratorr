import mongoose from 'mongoose';

// Disable mongoose buffering to eliminate 10000ms buffering timeout issues (Task 3)
mongoose.set('bufferCommands', false);
mongoose.set('strictQuery', true);

// Mongoose connection event listeners for diagnostics (Task 5)
mongoose.connection.on('connecting', () => {
  console.log('MongoDB: Connecting to database...');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB: Connected successfully.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB: Disconnected. Retrying connection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB: Reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB: Runtime connection error:', err.message || err);
});

// Cache connection promise to reuse existing connection across serverless invocations (Task 8)
let cachedConnectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  // Validate that process.env.MONGODB_URI is used exclusively (Task 6)
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.log('Database Connection Status: MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  // If already connected, reuse the connection (Task 8)
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If the connection is disconnected (0) or disconnecting (3), discard any cached connection promise
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cachedConnectionPromise = null;
  }

  if (cachedConnectionPromise) {
    return cachedConnectionPromise;
  }

  console.log('Connecting to MongoDB Atlas...');
  
  cachedConnectionPromise = mongoose.connect(MONGODB_URI)
    .then((m) => {
      return m;
    })
    .catch((err) => {
      cachedConnectionPromise = null; // Reset cache on failure
      console.error('CRITICAL ERROR: MongoDB connection failed:', err);
      throw err;
    });

  return cachedConnectionPromise;
};

// Graceful shutdown (avoid calling process.exit in serverless environments)
if (!process.env.VERCEL) {
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination.');
    } catch (err: any) {
      console.error('Error closing MongoDB connection:', err.message);
    }
  });
}
