// app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/admin/index.js";
import taxonomyRoutes from "./routes/taxonomyRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import settingsRoutes from "./routes/settings.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import config from "./config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const allowedOrigins = new Set(config.CORS.ALLOWED_ORIGINS);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (config.LOGGING.ENABLE && !config.isTest()) {
  app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
      const durationMs = Date.now() - startedAt;
      console.log(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`
      );
    });
    next();
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/taxonomy", taxonomyRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", favoritesRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", (req, res) => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.json({
    status: "OK",
    message: "API server is running",
    timestamp: new Date().toISOString(),
    database: states[mongoose.connection.readyState] || "unknown",
    version: "1.0.0",
    environment: config.NODE_ENV,
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Recipe platform API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
    },
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
