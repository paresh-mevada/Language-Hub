import dns from "node:dns";
import mongoose from "mongoose";

// Force public DNS servers for MongoDB SRV lookup
dns.setServers([
  "1.1.1.1",
  "8.8.8.8",
]);

console.log("[DNS] Using:", dns.getServers());

export function resolveMongoConnectionCandidates(
  mongodbUri = process.env.MONGODB_URI
) {
  const configuredUri = mongodbUri?.trim();

  return configuredUri ? [configuredUri] : [];
}

const connectDatabase = async () => {
  const connectionCandidates = resolveMongoConnectionCandidates();

  if (!connectionCandidates.length) {
    throw new Error("MONGODB_URI is not configured");
  }

  const [mongodbUri] = connectionCandidates;

  if (mongoose.connection.readyState === 1) {
    console.log("[DB] Already connected");
    return mongoose.connection;
  }

  try {
    console.log("[DB] Connecting to MongoDB...");

    const connectionInstance = await mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log(
      `[DB] MongoDB connected! Host: ${connectionInstance.connection.host}`
    );

    return connectionInstance;
  } catch (error) {
    console.error("[DB] MongoDB connection failed:");
    console.error(error.message);

    throw error;
  }
};

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export default connectDatabase;