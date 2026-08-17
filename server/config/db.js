import mongoose from 'mongoose';

async function connectDatabase() {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI is not configured. Starting API without a database connection.');
    return;
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

export default connectDatabase;
