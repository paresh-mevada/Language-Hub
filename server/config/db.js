import mongoose from 'mongoose';

// Cache the connection promise so serverless invocations reuse it
// instead of opening a new connection on every cold start.
let connectionPromise = null;

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.warn('[DB] MONGODB_URI is not configured. Running without a database connection.');
    return;
  }

  // Already connected — reuse existing connection (important for serverless)
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // If a connection attempt is already in progress, wait for it
  if (connectionPromise) {
    await connectionPromise;
    return;
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected.');
    connectionPromise = null; // allow reconnect on next request
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[DB] MongoDB reconnected.');
  });

  connectionPromise = (async () => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 2000;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
        });
        console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
        return;
      } catch (err) {
        const isLast = attempt === MAX_RETRIES;
        console.error(
          `[DB] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}` +
          (isLast ? '' : ` — retrying in ${RETRY_DELAY_MS / 1000}s…`)
        );

        if (isLast) {
          connectionPromise = null;
          console.error('[DB] All retries exhausted. API running without database.');
          console.error('[DB] → Verify MONGODB_URI is set in your deployment environment variables.');
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }
    }
  })();

  await connectionPromise;
}

/**
 * Returns true if Mongoose currently has an active connection.
 */
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDatabase;
