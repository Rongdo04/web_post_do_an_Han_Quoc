import dotenv from "dotenv";

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const toList = (value, fallback = []) => {
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const config = {
  PORT: toInt(process.env.PORT, 8000),
  NODE_ENV: nodeEnv,

  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/Web_Do_Chay",
  DB_NAME: process.env.DB_NAME || "Web_Do_Chay",

  JWT_SECRET: process.env.JWT_SECRET || "fallback_jwt_secret_for_development",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  EMAIL: {
    HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    PORT: toInt(process.env.EMAIL_PORT, 587),
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM,
    FROM_NAME: process.env.EMAIL_FROM_NAME || "MERN Authentication",
  },

  CORS: {
    ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5174",
    ALLOWED_ORIGINS: toList(process.env.ALLOWED_ORIGINS, [
      "http://localhost:5174",
      "http://localhost:3000",
    ]),
  },

  UPLOAD: {
    PATH: process.env.UPLOAD_PATH || "uploads",
    MAX_SIZE: toInt(process.env.MAX_FILE_SIZE, 5242880),
    ALLOWED_TYPES: toList(process.env.ALLOWED_FILE_TYPES, [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "pdf",
      "doc",
      "docx",
    ]),
  },

  SECURITY: {
    BCRYPT_ROUNDS: toInt(process.env.BCRYPT_ROUNDS, 12),
    SESSION_SECRET: process.env.SESSION_SECRET || "fallback_session_secret",
    COOKIE_SECRET: process.env.COOKIE_SECRET || "fallback_cookie_secret",
  },

  RATE_LIMIT: {
    WINDOW: toInt(process.env.RATE_LIMIT_WINDOW, 15),
    MAX_REQUESTS: toInt(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  },

  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || "info",
    ENABLE: process.env.ENABLE_LOGGING !== "false",
  },

  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || "admin@example.com",
    PASSWORD: process.env.ADMIN_PASSWORD || "admin123456",
  },

  isDevelopment: () => config.NODE_ENV === "development",
  isProduction: () => config.NODE_ENV === "production",
  isTest: () => config.NODE_ENV === "test",
};

export const validateConfig = () => {
  const issues = [];

  if (!config.MONGODB_URI) {
    issues.push("MONGODB_URI is required");
  }

  if (isProduction) {
    if (config.JWT_SECRET === "fallback_jwt_secret_for_development") {
      issues.push("JWT_SECRET must be set in production");
    }
    if (config.JWT_REFRESH_SECRET === "fallback_refresh_secret") {
      issues.push("JWT_REFRESH_SECRET must be set in production");
    }
    if (config.SECURITY.SESSION_SECRET === "fallback_session_secret") {
      issues.push("SESSION_SECRET must be set in production");
    }
  }

  if (issues.length > 0) {
    throw new Error(`Invalid environment configuration: ${issues.join("; ")}`);
  }
};

export default config;
