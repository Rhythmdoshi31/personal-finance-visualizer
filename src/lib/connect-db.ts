import mongoose from "mongoose"

const MONGODB_URI: string = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined!")
}

// Global cache to avoid reconnecting on every hot reload
const cached = (global as unknown) as { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn // Already connected

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise;
  (global as unknown) = cached

  return cached.conn;
}
