import mongoose from "mongoose";
import config from "./index.js";

let listenersBound = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);

    if (!listenersBound) {
      mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
      });

      listenersBound = true;
    }

    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

export { connectDB, disconnectDB };

export default connectDB;
