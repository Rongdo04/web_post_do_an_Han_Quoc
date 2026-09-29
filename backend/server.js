import mongoose from "mongoose";
import connectDB from "./config/database.js";
import config, { validateConfig } from "./config/index.js";
import app from "./app.js";

let server;

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }

    console.log("Shutdown complete.");
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    validateConfig();
    await connectDB();

    const port = config.PORT;
    server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log(`API Documentation: http://localhost:${port}/api/health`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

export default app;
