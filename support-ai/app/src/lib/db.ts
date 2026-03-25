// app/src/lib/db.ts
import mongoose from "mongoose";

const mongo_URL = process.env.MONGODB_URL;
if (!mongo_URL) {
  throw new Error("MongoDB URL not found in environment variables!");
}

let cache = (global as any).mongoose;

if (!cache) {
  cache = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongo_URL).then((c) => {
      console.log("✅ MongoDB Connected");
      return c.connection;
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    console.error("❌ DB Connection Failed:", error);
    throw error; // ✅ VERY IMPORTANT
  }

  return cache.conn;
};

export default connectDB;