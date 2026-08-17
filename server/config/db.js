import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.warn('[DB] MONGODB_URI is not configured. Running without a database connection.');
    return;
  }

  mongoose.set('strictQuery', true);

  // Reconnect automatically if the connection drops after initial connect
  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected. Mongoose will attempt to reconnect automatically.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('[DB] MongoDB reconnected successfully.');
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 8000,   // give up per-attempt after 8s
        socketTimeoutMS: 45000,
      });
      console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);
      return; // success – stop retrying
    } catch (err) {
      const isLast = attempt === MAX_RETRIES;
      console.error(
        `[DB] Connection attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}` +
        (isLast ? '' : ` — retrying in ${RETRY_DELAY_MS / 1000}s…`)
      );

      if (isLast) {
        // Log clearly but do NOT re-throw; let the API start in degraded mode
        console.error('[DB] Could not connect to MongoDB after all retries. API will run without a database.');
        console.error('[DB] Check your MONGODB_URI, network access, and MongoDB Atlas IP whitelist.');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export default connectDatabase;
